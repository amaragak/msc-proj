import React from "react";
import { AmountInput } from "../../Components/Input/AmountInput";
import { TextInput } from "../../Components/Input/TextInput";
import { DateTimeInput } from "../../Components/Input/DateTimeInput";
import { InputDialog } from "../../Components/Input/InputDialog";
import { UserState } from "../../Redux/State/UserState";
import Ledger from "@daml/ledger";
import { httpBaseUrl, wsBaseUrl } from "../../config";
import { Product } from "@daml.js/app-0.0.1/lib/Product";
import { getProductKey } from "../../Types/Product";
import { ProductMergeSplitEditHeader } from "../DataDisplay/EditHeaders/ProductMergeSplitEditHeader";
import { validateNumericString } from "../../Utils/ValidateNumericString";
import { endAfterStart } from "../../Utils/EndAfterStart"
import { ledgerDate, newEditDate, uiDate} from "../../Utils/DateFormat";
import { generateGuid } from "../../Utils/GenerateGuid"

interface ProductSplitEditProps {
  open: boolean;
  onClose: () => void;
  user: UserState;
  product: Product;
}

interface ProductSplitEditState {
  quantityA: string;
  quantityB: string;
  validationError: boolean;
  descriptionA: string;
  descriptionB: string;
  splitTime: string;
}

export class ProductSplitEdit extends React.Component<ProductSplitEditProps, ProductSplitEditState> {
  constructor(props: ProductSplitEditProps) {
    super(props);
    this.state = this.initialState(props);
  }

  private initialState(props: ProductSplitEditProps): ProductSplitEditState {
    return {
      quantityA: "",
      quantityB: "",
      validationError: false,
      splitTime: newEditDate(),
      descriptionA: "",
      descriptionB: ""
    }
  }
  
  private putToLedger = () => {
    if (!this.props.user.loggedIn) return;
    this.setState({ validationError: false });
    const { product } = this.props;
    const { quantityA, quantityB, splitTime, descriptionA, descriptionB } = this.state;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    const productKey = getProductKey(product);
    const choiceArgs = { 
      quantityA,
      quantityB,
      recordTime: ledgerDate(splitTime),
      recordId: generateGuid(),
      productIdB: generateGuid(),
      descriptionA,
      descriptionB
    };
    ledger.exerciseByKey(Product.SplitProduct, productKey, choiceArgs)
      .then(() => this.onClose());
  }

  private onClose = () => {
    this.setState({ validationError: false });
    this.props.onClose();
  }

  private onOkay = () => {
    const { quantityA, quantityB, splitTime, descriptionA, descriptionB } = this.state;
    const { product } = this.props;
    const quantityAGood = validateNumericString(quantityA);
    const quantityBGood = validateNumericString(quantityB);
    const timeGood = endAfterStart({ startTime: product.lastUpdated, endTime: splitTime })
    if (quantityAGood && quantityBGood && timeGood && !!descriptionA && !!descriptionB) this.putToLedger();
    else this.setState({ validationError: true });
  }
  
  renderInputs() {
    const { user, product } = this.props;
    const { validationError, quantityB, quantityA, splitTime, descriptionA, descriptionB } = this.state;
    if (!user.loggedIn) return null;
    return (
      <>
        <ProductMergeSplitEditHeader product={product}/>
        <AmountInput
          onChangeQuantity={quantityA => {
            const productQuantityAsNumber = +product.productInfo.amount.quantity;
            const quantityAAsNumber = +quantityA;
            const quantityBAsNumber = quantityAAsNumber > productQuantityAsNumber 
              ? 0
              : quantityAAsNumber <= 0.0 
                ? productQuantityAsNumber
                : productQuantityAsNumber - quantityAAsNumber;

            this.setState({ ...this.state, quantityA, quantityB: String(quantityBAsNumber)});
          }}
          unit={product.productInfo.amount.unit}
          unitDisabled={true}
          onChangeUnit={() => {}}
          unitOptions={[product.productInfo.amount.unit]}
          quantityLabel="Split Amount A"
          unitLabel="Unit"
          quantityError={validationError && !validateNumericString(quantityA)}
          errorMessage={validationError  && !validateNumericString(quantityA) ? "Amount must be above 0 and less than current amount (" + product.productInfo.amount.quantity + ")" : undefined}
        />
        <AmountInput
          onChangeQuantity={() => {}}
          unit={product.productInfo.amount.unit}
          unitDisabled={true}
          quantityDisabled={true}
          onChangeUnit={() => {}}
          unitOptions={[product.productInfo.amount.unit]}
          quantityLabel="Split Amount B"
          quantity={quantityB}
          unitLabel="Unit"
        />
        <TextInput
          label="New Description A"
          onChange={descriptionA => this.setState({ ...this.state, descriptionA })}
          error={validationError && !descriptionA}
        />
        <TextInput
          label="New Description B"
          onChange={descriptionB => this.setState({ ...this.state, descriptionB })}
          error={validationError && !descriptionB}
        />
        <DateTimeInput
          label="Split Time"
          onChange={value => this.setState({ ...this.state, splitTime: value })}
          value={splitTime}
          error={validationError && (!splitTime || !endAfterStart({ startTime: product.lastUpdated, endTime: splitTime }))}
          errorMessage={(validationError && !endAfterStart({ startTime: product.lastUpdated, endTime: splitTime })) ? "Must be after " + uiDate(product.lastUpdated) + " (last record time)" : undefined}
        />
      </>
    );
  }
  
  render() {
    return (
      <InputDialog
        title={"Split Product"}
        children={this.renderInputs()}
        open={this.props.open}
        onOkay={this.onOkay}
        onCancel={this.onClose}
        onEnter={() => this.setState(this.initialState(this.props))}
      />
    );
  }
}
