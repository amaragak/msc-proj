import React from "react";
import { InputDialog } from "../../Components/Input/InputDialog";
import { UserState } from "../../Redux/State/UserState";
import Ledger from "@daml/ledger";
import { httpBaseUrl, wsBaseUrl } from "../../config";
import { TransportationRequest, Product } from "@daml.js/app-0.0.1/lib/Product";
import { ContractId } from "@daml/types";
import { ProductOrderCidTag } from "../../Types/Product";
import { TransportationAcceptEditHeader } from "../DataDisplay/EditHeaders/TransportationAcceptEditHeader";

interface TransportationWithdrawRequestEditProps {
  open: boolean;
  onClose: () => void;
  user: UserState;
  product: Product;
}

interface TransportationWithdrawRequestEditState {
  request: TransportationRequest | undefined;
  requestCid: ContractId<TransportationRequest> | undefined;
}

export class TransportationWithdrawRequestEdit extends React.Component<TransportationWithdrawRequestEditProps, TransportationWithdrawRequestEditState> {
  constructor(props: TransportationWithdrawRequestEditProps) {
    super(props);
    this.state = this.initialState();
  }

  private initialState(): TransportationWithdrawRequestEditState {
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
    if (!product.orderCid || product.orderCid.tag !== ProductOrderCidTag.TRANSPORTATION_REQUEST) return;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    ledger.fetch(TransportationRequest, product.orderCid.value)
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
    ledger.exercise(TransportationRequest.WithdrawTransportationRequest, requestCid, {})
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
        <TransportationAcceptEditHeader product={product} request={request}/>
      </>
    );
  }
  
  render() {
    return (
      <InputDialog
        title="Withdraw Transportation Request"
        children={this.renderInputs()}
        open={this.props.open}
        onOkay={this.onOkay}
        onCancel={this.onClose}
        onEnter={() => this.setState(this.initialState())}
      />
    );
  }
}
