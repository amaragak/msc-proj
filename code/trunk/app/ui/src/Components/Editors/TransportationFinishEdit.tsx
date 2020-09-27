import React from "react";
import { DateTimeInput } from "../../Components/Input/DateTimeInput";
import { InputDialog } from "../../Components/Input/InputDialog";
import { UserState } from "../../Redux/State/UserState";
import Ledger from "@daml/ledger";
import { httpBaseUrl, wsBaseUrl } from "../../config";
import { Product, ActiveTransportationOrder } from "@daml.js/app-0.0.1/lib/Product";
import { ContractId } from "@daml/types";
import { ProductOrderCidTag } from "../../Types/Product";
import { endAfterStart } from "../../Utils/EndAfterStart";
import { newEditDate, ledgerDate } from "../../Utils/DateFormat";
import { generateGuid } from "../../Utils/GenerateGuid";
import { TransportationFinishEditHeader } from "../DataDisplay/EditHeaders/TransportationFinishEditHeader";
import { truthyFields } from "../../Utils/TruthyFields";
import { uiDate } from "../../Utils/DateFormat";

interface FinishTransportationEditProps {
  open: boolean;
  onClose: () => void;
  user: UserState;
  product: Product;
}

interface FinishTransportationEditState {
  validationError: boolean;
  order: ActiveTransportationOrder | undefined;
  orderCid: ContractId<ActiveTransportationOrder> | undefined;
  endTime: string;
}
export class TransportationFinishEdit extends React.Component<FinishTransportationEditProps, FinishTransportationEditState> {
  constructor(props: FinishTransportationEditProps) {
    super(props);
    this.state = this.initialState();
  }

  private initialState(): FinishTransportationEditState {
    return {
      endTime: newEditDate(),
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
    if (!product.orderCid || product.orderCid.tag !== ProductOrderCidTag.TRANSPORTATION_ACTIVE) return;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    ledger.fetch(ActiveTransportationOrder, product.orderCid.value)
      .then(orderContract => {
        this.mounted && this.setState({ 
          ...this.state, 
          order: orderContract?.payload, 
          orderCid: orderContract?.contractId
        });
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }
  
  private putToLedger = () => {
    if (!this.props.user.loggedIn) return;
    this.setState({ validationError: false });
    const { endTime, orderCid, order } = this.state;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    if (!orderCid || !order) return;
    const choiceArgs = { 
      recordId: generateGuid(),
      recordTime: ledgerDate(endTime)
    };
    ledger.exercise(ActiveTransportationOrder.CompleteTransportationOrder, orderCid, choiceArgs)
      .then(() => this.props.onClose());
  }

  private onOkay = () => {
    const { endTime } = this.state;
    const { lastUpdated } = this.props.product;
    if (endAfterStart({ endTime: endTime, startTime: lastUpdated }) && truthyFields(this.state)) {
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
        <TransportationFinishEditHeader product={product} order={order}/>
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
        title="Complete Transportation"
        children={this.renderInputs()}
        open={this.props.open}
        onOkay={this.onOkay}
        onCancel={this.props.onClose}
        onEnter={() => this.setState(this.initialState())}
      />
    );
  }
}
