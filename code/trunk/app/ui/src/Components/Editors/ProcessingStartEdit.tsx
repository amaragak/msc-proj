import React from "react";
import { DateTimeInput } from "../../Components/Input/DateTimeInput";
import { InputDialog } from "../../Components/Input/InputDialog";
import { UserState } from "../../Redux/State/UserState";
import Ledger from "@daml/ledger";
import { httpBaseUrl, wsBaseUrl } from "../../config";
import { NewProcessingOrder, Product } from "@daml.js/app-0.0.1/lib/Product";
import { ContractId } from "@daml/types";
import { ProductOrderCidTag } from "../../Types/Product";
import { endAfterStart } from "../../Utils/EndAfterStart";
import { newEditDate, ledgerDate, uiDate } from "../../Utils/DateFormat";
import { generateGuid } from "../../Utils/GenerateGuid";
import { ProcessingStartEditHeader } from "../DataDisplay/EditHeaders/ProcessingStartEditHeader";

interface StartProcessingEditProps {
  open: boolean;
  onClose: () => void;
  user: UserState;
  product: Product;
}

interface StartProcessingEditState {
  validationError: boolean;
  newOrder: NewProcessingOrder | undefined;
  newOrderCid: ContractId<NewProcessingOrder> | undefined;
  startTime: string;
}

export class ProcessingStartEdit extends React.Component<StartProcessingEditProps, StartProcessingEditState> {
  constructor(props: StartProcessingEditProps) {
    super(props);
    this.state = { startTime: newEditDate(), validationError: false, newOrder: undefined, newOrderCid: undefined };
  }

  private mounted: boolean = false;

  componentDidMount() {
    this.mounted = true;
    const { product } = this.props;
    this.setState({ validationError: false });
    if (!this.props.user.loggedIn) return;
    if (!product.orderCid || product.orderCid.tag !== ProductOrderCidTag.PROCESSING_NEW) return;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    ledger.fetch(NewProcessingOrder, product.orderCid.value)
      .then(orderContract => {
        this.mounted && this.setState({ ...this.state, newOrder: orderContract?.payload, newOrderCid: orderContract?.contractId });
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }
  
  private putToLedger = () => {
    if (!this.props.user.loggedIn) return;
    const { startTime, newOrderCid } = this.state;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    if (!newOrderCid) return;
    const choiceArgs = { 
      recordId: generateGuid(),
      recordTime: ledgerDate(startTime)
    };
    ledger.exercise(NewProcessingOrder.StartProcessingOrder, newOrderCid, choiceArgs)
      .then(() => this.onClose());
  }

  private onClose = () => {
    this.setState({ validationError: false });
    this.props.onClose();
  }

  private onOkay = () => {
    const { startTime } = this.state;
    const { lastUpdated } = this.props.product;
    if (endAfterStart({ endTime: startTime, startTime: lastUpdated })) this.putToLedger();
    else this.setState({ validationError: true });
  }
  
  renderInputs() {
    const { user, product } = this.props;
    const { validationError, startTime, newOrder } = this.state;
    if (!user.loggedIn || !newOrder) return null
    return (
      <>
        <ProcessingStartEditHeader product={product} newOrder={newOrder}/>
        <DateTimeInput
          label="Start Time"
          onChange={value => this.setState({ ...this.state, startTime: value })}
          value={startTime}
          error={validationError && (!startTime || !endAfterStart({ startTime: product.lastUpdated, endTime: startTime }))}
          errorMessage={(validationError && !endAfterStart({ startTime: product.lastUpdated, endTime: startTime })) ? "Must be after " + uiDate(product.lastUpdated) + " (last record time)" : undefined}
        />
      </>
    );
  }
  
  render() {
    return (
      <InputDialog
        title="Start Processing"
        children={this.renderInputs()}
        open={this.props.open}
        onOkay={this.onOkay}
        onCancel={this.onClose}
        onEnter={() => this.setState({ startTime: newEditDate(), validationError: false })}
      />
    );
  }
}
