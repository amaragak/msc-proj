import React from "react";
import { InputDialog } from "../../Components/Input/InputDialog";
import { UserState } from "../../Redux/State/UserState";
import Ledger from "@daml/ledger";
import { httpBaseUrl, wsBaseUrl } from "../../config";
import { SaleRequest, Product } from "@daml.js/app-0.0.1/lib/Product";
import { ContractId } from "@daml/types";
import { ProductOrderCidTag } from "../../Types/Product";
import { SaleAcceptEditHeader } from "../DataDisplay/EditHeaders/SaleAcceptEditHeader";

interface SaleWithdrawRequestEditProps {
  open: boolean;
  onClose: () => void;
  user: UserState;
  product: Product;
}

interface SaleWithdrawRequestEditState {
  request: SaleRequest | undefined;
  requestCid: ContractId<SaleRequest> | undefined;
}

export class SaleWithdrawRequestEdit extends React.Component<SaleWithdrawRequestEditProps, SaleWithdrawRequestEditState> {
  constructor(props: SaleWithdrawRequestEditProps) {
    super(props);
    this.state = this.initialState();
  }

  private initialState(): SaleWithdrawRequestEditState {
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
    if (!product.orderCid || product.orderCid.tag !== ProductOrderCidTag.SALE_REQUEST) return;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    ledger.fetch(SaleRequest, product.orderCid.value)
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
    ledger.exercise(SaleRequest.WithdrawSaleRequest, requestCid, {})
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
        <SaleAcceptEditHeader product={product} request={request}/>
      </>
    );
  }
  
  render() {
    return (
      <InputDialog
        title="Withdraw Offer"
        children={this.renderInputs()}
        open={this.props.open}
        onOkay={this.onOkay}
        onCancel={this.onClose}
        onEnter={() => this.setState(this.initialState())}
      />
    );
  }
}
