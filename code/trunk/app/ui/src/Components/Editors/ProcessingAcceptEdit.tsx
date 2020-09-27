import React from "react";
import { DateTimeInput } from "../../Components/Input/DateTimeInput";
import { InputDialog } from "../../Components/Input/InputDialog";
import { AcceptDecline } from "../../Components/Input/AcceptDecline";
import { UserState } from "../../Redux/State/UserState";
import Ledger from "@daml/ledger";
import { httpBaseUrl, wsBaseUrl } from "../../config";
import { ProcessingRequest, Product } from "@daml.js/app-0.0.1/lib/Product";
import { ContractId } from "@daml/types";
import { ProductOrderCidTag } from "../../Types/Product";
import { truthyFields } from "../../Utils/TruthyFields";
import { newEditDate, ledgerDate, uiDate } from "../../Utils/DateFormat";
import { endAfterStart } from "../../Utils/EndAfterStart";
import { generateGuid } from "../../Utils/GenerateGuid";
import { ProcessingAcceptEditHeader } from "../DataDisplay/EditHeaders/ProcessingAcceptEditHeader";

interface ProcessingAcceptEditProps {
  open: boolean;
  onClose: () => void;
  user: UserState;
  product: Product;
}

interface ProcessingAcceptEditState {
  handoverTime: string;
  accept: boolean;
  validationError: boolean;
  request: ProcessingRequest | undefined;
  requestCid: ContractId<ProcessingRequest> | undefined;
}

export class ProcessingAcceptEdit extends React.Component<ProcessingAcceptEditProps, ProcessingAcceptEditState> {
  constructor(props: ProcessingAcceptEditProps) {
    super(props);
    this.state = this.initialState();
  }

  private initialState(): ProcessingAcceptEditState {
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
    this.setState({ validationError: false });
    if (!product.orderCid || product.orderCid.tag !== ProductOrderCidTag.PROCESSING_REQUEST) return;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    ledger.fetch(ProcessingRequest, product.orderCid.value)
      .then(requestContract => {
        this.mounted && this.setState({ ...this.state, request: requestContract?.payload, requestCid: requestContract?.contractId });
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }
  
  private putAcceptToLedger = () => {
    if (!this.props.user.loggedIn) return;
    this.setState({ validationError: false });
    const { handoverTime, requestCid } = this.state;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    if (!requestCid) return;
    const choiceArgs = { 
      processId: generateGuid(),
      recordId: generateGuid(),
      recordTime: ledgerDate(handoverTime)
    };
    ledger.exercise(ProcessingRequest.AcceptProcessingRequest, requestCid, choiceArgs)
      .then(() => this.onClose());
  }

  private putDeclineToLedger = () => {
    if (!this.props.user.loggedIn) return;
    const { requestCid } = this.state;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    if (!requestCid) return;
    ledger.exercise(ProcessingRequest.DeclineProcessingRequest, requestCid, {})
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
    const { validationError, handoverTime, request } = this.state;
    if (!user.loggedIn || !request) return null
    return (
      <>
        <ProcessingAcceptEditHeader product={product} request={request}/>
        <AcceptDecline accept={this.state.accept} onChange={value => this.setState({  ...this.state, accept: value })}/>
        <DateTimeInput
          label="Handover Time"
          onChange={value => this.setState({ ...this.state, handoverTime: value })}
          value={handoverTime}
          error={validationError && (!handoverTime || !endAfterStart({ startTime: product.lastUpdated, endTime: handoverTime }))}
          disabled={!this.state.accept}
          errorMessage={(validationError && !endAfterStart({ startTime: product.lastUpdated, endTime: handoverTime })) ? "Must be after " + uiDate(product.lastUpdated) + " (last record time)" : undefined}
        />
      </>
    );
  }
  
  render() {
    return (
      <InputDialog
        title="Review Processing Request"
        children={this.renderInputs()}
        open={this.props.open}
        onOkay={this.onOkay}
        onCancel={this.onClose}
        onEnter={() => this.setState(this.initialState())}
      />
    );
  }
}
