import React from "react";
import { AutocompleteInput } from "../../Components/Input/AutocompleteInput";
import { DateTimeInput } from "../../Components/Input/DateTimeInput";
import { InputDialog } from "../../Components/Input/InputDialog";
import { TextInput } from "../../Components/Input/TextInput";
import { UserState } from "../../Redux/State/UserState";
import Ledger from "@daml/ledger";
import { httpBaseUrl, wsBaseUrl } from "../../config";
import { Product } from "@daml.js/app-0.0.1/lib/Product";
import { getProductKey } from "../../Types/Product";
import { ProductMergeSplitEditHeader } from "../DataDisplay/EditHeaders/ProductMergeSplitEditHeader";
import { endAfterStart } from "../../Utils/EndAfterStart"
import { ledgerDate, newEditDate, uiDate} from "../../Utils/DateFormat";
import { generateGuid } from "../../Utils/GenerateGuid"
import moment from "moment";

interface ProductMergeEditProps {
  open: boolean;
  onClose: () => void;
  user: UserState;
  product: Product;
  allProducts: Product[];
}

interface ProductMergeEditState {
  mergeWith: Product | undefined;
  mergeTime: string;
  description: string;
  validationError: boolean;
}

export class ProductMergeEdit extends React.Component<ProductMergeEditProps, ProductMergeEditState> {
  constructor(props: ProductMergeEditProps) {
    super(props);
    this.state = this.initialState(props);
  }

  private initialState(props: ProductMergeEditProps): ProductMergeEditState {
    return {
      mergeWith: undefined,
      validationError: false,
      mergeTime: newEditDate(),
      description: ""
    }
  }
  
  private putToLedger = () => {
    if (!this.props.user.loggedIn) return;
    this.setState({ validationError: false });
    const { product } = this.props;
    const { mergeWith, mergeTime, description } = this.state;
    if (!mergeWith) return;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    const productKey = getProductKey(product);
    const otherProductKey = getProductKey(mergeWith);
    const choiceArgs = { 
      otherProductKey,
      recordTime: ledgerDate(mergeTime),
      recordId: generateGuid(),
      newDescription: description
    };
    ledger.exerciseByKey(Product.MergeProduct, productKey, choiceArgs)
      .then(() => this.onClose());
  }

  private onClose = () => {
    this.setState({ validationError: false });
    this.props.onClose();
  }

  private onOkay = () => {
    const { mergeTime, mergeWith, description } = this.state;
    if (!!mergeWith && endAfterStart({ startTime: this.lastUpdated(), endTime: mergeTime }) && !!description ) this.putToLedger();
    else this.setState({ validationError: true });
  }

  private lastUpdated() {
    const { product } = this.props;
    const { mergeWith } = this.state;
    const mostRecent = mergeWith
      ? moment(product.lastUpdated).isAfter(moment(mergeWith.lastUpdated))
        ? product.lastUpdated 
        : mergeWith.lastUpdated
      : product.lastUpdated;
    return mostRecent;
  }
  
  renderInputs() {
    const { user, product, allProducts } = this.props;
    const { validationError, mergeWith, mergeTime, description } = this.state;
    if (!user.loggedIn) return null;
    const party = user.username;
    const lastUpdated = this.lastUpdated();
    return (
      <>
        <ProductMergeSplitEditHeader product={product}/>
        <AutocompleteInput<Product>
          label="Merge With"
          options={allProducts.filter(p => {
            const isOwner = (p.owner === party);
            const isHandler = (p.handler === party);
            const differentId = p.productId !== product.productId;
            const sameType = p.productInfo.typeId === product.productInfo.typeId;
            return isOwner && isHandler && differentId && sameType;
          })}
          onChange={value => this.setState({ ...this.state, mergeWith: value ? value : undefined })}
          getOptionLabel={option => option.description}
          error={validationError && !mergeWith}
        />
        <TextInput
          label="New Description"
          onChange={description => this.setState({ ...this.state, description })}
          error={validationError && !description}
        />
        <DateTimeInput
          label="Merge Time"
          onChange={value => this.setState({ ...this.state, mergeTime: value })}
          value={mergeTime}
          error={validationError && (!mergeTime || !endAfterStart({ startTime: lastUpdated, endTime: mergeTime }))}
          errorMessage={(validationError && !endAfterStart({ startTime: lastUpdated, endTime: mergeTime })) ? "Must be after " + uiDate(lastUpdated) + " (last record time)" : undefined}
        />
      </>
    );
  }
  
  render() {
    return (
      <InputDialog
        title={"Merge Product"}
        children={this.renderInputs()}
        open={this.props.open}
        onOkay={this.onOkay}
        onCancel={this.onClose}
        onEnter={() => this.setState(this.initialState(this.props))}
      />
    );
  }
}
