import React from "react";
import { DateTimeInput } from "../../Components/Input/DateTimeInput";
import { InputDialog } from "../../Components/Input/InputDialog";
import { TextInput } from "../../Components/Input/TextInput";
import { AmountInput } from "../../Components/Input/AmountInput";
import { UserState } from "../../Redux/State/UserState";
import Ledger from "@daml/ledger";
import { httpBaseUrl, wsBaseUrl } from "../../config";
import { Product, ActiveProcessingOrder } from "@daml.js/app-0.0.1/lib/Product";
import { ContractId } from "@daml/types";
import { ProductOrderCidTag } from "../../Types/Product";
import { processedProductTypeFromId, unitToString, generateLabelForTypeId } from "../../Types/ProductType";
import { endAfterStart } from "../../Utils/EndAfterStart";
import { newEditDate, ledgerDate } from "../../Utils/DateFormat";
import { generateGuid } from "../../Utils/GenerateGuid";
import { ProcessingFinishEditHeader } from "../DataDisplay/EditHeaders/ProcessingFinishEditHeader";
import { truthyFields } from "../../Utils/TruthyFields";
import { uiDate } from "../../Utils/DateFormat";
import { validateNumericString } from "../../Utils/ValidateNumericString";

interface FinishProcessingEditProps {
  open: boolean;
  onClose: () => void;
  user: UserState;
  product: Product;
}

interface FinishProcessingEditState {
  validationError: boolean;
  order: ActiveProcessingOrder | undefined;
  orderCid: ContractId<ActiveProcessingOrder> | undefined;
  endTime: string;
  quantity: string;
  label: string;
}

export class ProcessingFinishEdit extends React.Component<FinishProcessingEditProps, FinishProcessingEditState> {
  constructor(props: FinishProcessingEditProps) {
    super(props);
    this.state = this.initialState();
  }

  private initialState(): FinishProcessingEditState {
    return {
      endTime: newEditDate(),
      quantity: "",
      label: "",
      validationError: false,
      order: undefined,
      orderCid: undefined
    }
  }

  private mounted: boolean = false;

  componentDidMount() {
    this.mounted = true;
    const { product } = this.props;
    if (!this.props.user.loggedIn) return;
    if (!product.orderCid || product.orderCid.tag !== ProductOrderCidTag.PROCESSING_ACTIVE) return;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    ledger.fetch(ActiveProcessingOrder, product.orderCid.value)
      .then(orderContract => {
        this.mounted && this.setState({ 
          ...this.state, 
          order: orderContract?.payload, 
          orderCid: orderContract?.contractId,
          label: orderContract ? generateLabelForTypeId(orderContract.payload.outputType) : ""
        });
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }
  
  private putToLedger = () => {
    if (!this.props.user.loggedIn) return;
    this.setState({ validationError: false });
    const { endTime, orderCid, quantity, label, order } = this.state;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    if (!orderCid || !order) return;
    const choiceArgs = { 
      recordId: generateGuid(),
      recordTime: ledgerDate(endTime),
      recordOutputProduct: {
        labels: [label],
        amount: { 
          quantity, 
          unit: unitToString(processedProductTypeFromId(order.outputType).unit)
        },
        typeId: order?.outputType,
      }
    };
    ledger.exercise(ActiveProcessingOrder.CompleteProcessingOrder, orderCid, choiceArgs)
      .then(() => this.props.onClose());
  }

  private onOkay = () => {
    const { endTime, quantity } = this.state;
    const { lastUpdated } = this.props.product;
    if (endAfterStart({ endTime: endTime, startTime: lastUpdated }) && truthyFields(this.state) && validateNumericString(quantity)) {
      this.putToLedger();
    }
    else this.setState({ validationError: true }); 
  }
  
  renderInputs() {
    const { user, product } = this.props;
    const { validationError, endTime, order } = this.state;
    if (!user.loggedIn || !order) return null
    return (
      <>
        <ProcessingFinishEditHeader product={product} order={order}/>
        <TextInput
          label="Output Label"
          onChange={value => this.setState({  ...this.state, label: value })}
          error={validationError && !this.state.label}
          value={this.state.label}
          disabled={true}
        />
        <AmountInput
          onChangeQuantity={value => this.setState({ ...this.state, quantity: value })}
          onChangeUnit={(value) => {}}
          unitOptions={["kg", "litres"]}
          unit={unitToString(processedProductTypeFromId(order.outputType).unit)}
          quantityLabel="Output Quantity"
          unitLabel="Unit"
          unitDisabled={true}
          quantityError={validationError && (!this.state.quantity || !validateNumericString(this.state.quantity))}
          unitError={false}
        />
        <DateTimeInput
          label="End Time"
          onChange={value => this.setState({ ...this.state, endTime: value })}
          value={endTime}
          error={validationError && (!endTime || !endAfterStart({ startTime: product.lastUpdated, endTime }))}
          errorMessage={(validationError && !endAfterStart({ startTime: product.lastUpdated, endTime })) ? "Must be after " + uiDate(product.lastUpdated) + " (last record time)" : undefined}
        />
      </>
    );
  }
  
  render() {
    return (
      <InputDialog
        title="Complete Processing"
        children={this.renderInputs()}
        open={this.props.open}
        onOkay={this.onOkay}
        onCancel={this.props.onClose}
        onEnter={() => this.setState(this.initialState())}
      />
    );
  }
}
