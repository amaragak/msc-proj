import React from "react";
import { DateTimeInput } from "../../Components/Input/DateTimeInput";
import { InputDialog } from "../../Components/Input/InputDialog";
import { UserState } from "../../Redux/State/UserState";
import Ledger from "@daml/ledger";
import { httpBaseUrl, wsBaseUrl } from "../../config";
import { HandoverRequest, Product } from "@daml.js/app-0.0.1/lib/Product";
import { ContractId } from "@daml/types";
import { ProductOrderCidTag } from "../../Types/Product";
import { truthyFields } from "../../Utils/TruthyFields";
import { newEditDate, ledgerDate, uiDate } from "../../Utils/DateFormat";
import { endAfterStart } from "../../Utils/EndAfterStart";
import { generateGuid } from "../../Utils/GenerateGuid";
import { HandoverAcceptEditHeader } from "../DataDisplay/EditHeaders/HandoverAcceptEditHeader";
import { AcceptDecline } from "../../Components/Input/AcceptDecline";

interface HandoverAcceptEditProps {
  open: boolean;
  onClose: () => void;
  user: UserState;
  product: Product;
}

interface HandoverAcceptEditState {
  handoverTime: string;
  accept: boolean;
  validationError: boolean;
  request: HandoverRequest | undefined;
  requestCid: ContractId<HandoverRequest> | undefined;
}

export class HandoverAcceptEdit extends React.Component<HandoverAcceptEditProps, HandoverAcceptEditState> {
  constructor(props: HandoverAcceptEditProps) {
    super(props);
    this.state = this.initialState();
  }

  private initialState(): HandoverAcceptEditState {
    return {
      handoverTime: newEditDate(), 
      validationError: false, 
      request: undefined, 
      requestCid: undefined, 
      accept : true
    };
  }

  private mounted: boolean = false;

  componentDidMount() {
    this.mounted = true;
    const { product } = this.props;
    if (!this.props.user.loggedIn) return;
    if (!product.orderCid || product.orderCid.tag !== ProductOrderCidTag.HANDOVER_REQUEST) return;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    ledger.fetch(HandoverRequest, product.orderCid.value)
      .then(requestContract => {
        this.mounted && this.setState({ ...this.state, request: requestContract?.payload, requestCid: requestContract?.contractId });
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  private putDeclineToLedger = () => {
    if (!this.props.user.loggedIn) return;
    this.setState({ validationError: false });
    const { requestCid } = this.state;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    if (!requestCid) return;
    ledger.exercise(HandoverRequest.DeclineHandoverRequest, requestCid, {})
      .then(() => this.onClose());
  }
  
  private putAcceptToLedger = () => {
    if (!this.props.user.loggedIn) return;
    this.setState({ validationError: false });
    const { handoverTime, requestCid } = this.state;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    if (!requestCid) return;
    const choiceArgs = { 
      transportId: generateGuid(),
      recordId: generateGuid(),
      recordTime: ledgerDate(handoverTime)
    };
    ledger.exercise(HandoverRequest.AcceptHandoverRequest, requestCid, choiceArgs)
      .then(() => this.onClose());
  }

  private onClose = () => {
    this.setState({ validationError: false });
    this.props.onClose();
  }

  private onOkay = () => {
    const { accept, handoverTime } = this.state;
    const { product } = this.props;
    if (!accept) {
      this.putDeclineToLedger();
    } else if (truthyFields({ handoverTime }) && endAfterStart({ startTime: product.lastUpdated, endTime: handoverTime })) {
      this.putAcceptToLedger();
    }
    else this.setState({ validationError: true });
  }
  
  renderInputs() {
    const { user, product } = this.props;
    const { validationError, accept, request, handoverTime } = this.state;
    if (!user.loggedIn || !request) return null
    return (
      <>
        <HandoverAcceptEditHeader product={product} request={request}/>
        <AcceptDecline accept={accept} onChange={value => this.setState({  ...this.state, accept: value })}/>
        <DateTimeInput
          label="Handover Time"
          onChange={value => this.setState({ ...this.state, handoverTime: value })}
          value={handoverTime}
          error={validationError && (!handoverTime || !endAfterStart({ startTime: product.lastUpdated, endTime: handoverTime }))}
          errorMessage={(validationError && !endAfterStart({ startTime: product.lastUpdated, endTime: handoverTime })) ? "Must be after " + uiDate(product.lastUpdated) + " (last record time)" : undefined}
        />
      </>
    );
  }
  
  render() {
    return (
      <InputDialog
        title="Review Handover Request"
        children={this.renderInputs()}
        open={this.props.open}
        onOkay={this.onOkay}
        onCancel={this.onClose}
        onEnter={() => this.setState(this.initialState())}
      />
    );
  }
}
