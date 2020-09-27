import React from "react";
import { InputDialog } from "../../Components/Input/InputDialog";
import { UserState } from "../../Redux/State/UserState";
import Ledger from "@daml/ledger";
import { httpBaseUrl, wsBaseUrl } from "../../config";
import { HandoverRequest, Product } from "@daml.js/app-0.0.1/lib/Product";
import { ContractId } from "@daml/types";
import { ProductOrderCidTag } from "../../Types/Product";
import { HandoverAcceptEditHeader } from "../DataDisplay/EditHeaders/HandoverAcceptEditHeader";

interface HandoverWithdrawRequestEditProps {
  open: boolean;
  onClose: () => void;
  user: UserState;
  product: Product;
}

interface HandoverWithdrawRequestEditState {
  request: HandoverRequest | undefined;
  requestCid: ContractId<HandoverRequest> | undefined;
}

export class HandoverWithdrawRequestEdit extends React.Component<HandoverWithdrawRequestEditProps, HandoverWithdrawRequestEditState> {
  constructor(props: HandoverWithdrawRequestEditProps) {
    super(props);
    this.state = this.initialState();
  }

  private initialState(): HandoverWithdrawRequestEditState {
    return {
      request: undefined, 
      requestCid: undefined,
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
  
  private putWithdrawToLedger = () => {
    if (!this.props.user.loggedIn) return;
    const { requestCid } = this.state;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    if (!requestCid) return;
    ledger.exercise(HandoverRequest.WithdrawHandoverRequest, requestCid, {})
      .then(() => this.onClose());
  }

  private onClose = () => {
    this.props.onClose();
  }

  private onOkay = () => {
    this.putWithdrawToLedger();
  }
  
  renderInputs() {
    const { user, product } = this.props;
    const { request } = this.state;
    if (!user.loggedIn || !request) return null
    return (
      <>
        <HandoverAcceptEditHeader product={product} request={request}/>
      </>
    );
  }
  
  render() {
    return (
      <InputDialog
        title="Withdraw Handover Request"
        children={this.renderInputs()}
        open={this.props.open}
        onOkay={this.onOkay}
        onCancel={this.onClose}
        onEnter={() => this.setState(this.initialState())}
      />
    );
  }
}
