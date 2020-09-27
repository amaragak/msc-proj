import React from "react";
import { DateTimeInput } from "../../Components/Input/DateTimeInput";
import { InputDialog } from "../../Components/Input/InputDialog";
import { UserState } from "../../Redux/State/UserState";
import Ledger from "@daml/ledger";
import { httpBaseUrl, wsBaseUrl } from "../../config";
import { SaleRequest, Product } from "@daml.js/app-0.0.1/lib/Product";
import { ContractId } from "@daml/types";
import { ProductOrderCidTag } from "../../Types/Product";
import { truthyFields } from "../../Utils/TruthyFields";
import { newEditDate, ledgerDate, uiDate } from "../../Utils/DateFormat";
import { endAfterStart } from "../../Utils/EndAfterStart";
import { generateGuid } from "../../Utils/GenerateGuid";
import { SaleAcceptEditHeader } from "../DataDisplay/EditHeaders/SaleAcceptEditHeader";
import { AcceptDecline } from "../../Components/Input/AcceptDecline";

interface SaleAcceptEditProps {
  open: boolean;
  onClose: () => void;
  user: UserState;
  product: Product;
}

interface SaleAcceptEditState {
  saleTime: string;
  accept: boolean;
  validationError: boolean;
  request: SaleRequest | undefined;
  requestCid: ContractId<SaleRequest> | undefined;
}

export class SaleAcceptEdit extends React.Component<SaleAcceptEditProps, SaleAcceptEditState> {
  constructor(props: SaleAcceptEditProps) {
    super(props);
    this.state = this.initialState();
  }

  private initialState(): SaleAcceptEditState {
    return {
      saleTime: newEditDate(), 
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

  private putDeclineToLedger = () => {
    if (!this.props.user.loggedIn) return;
    this.setState({ validationError: false });
    const { requestCid } = this.state;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    if (!requestCid) return;
    ledger.exercise(SaleRequest.DeclineSaleRequest, requestCid, {})
      .then(() => this.onClose());
  }
  
  private putAcceptToLedger = () => {
    if (!this.props.user.loggedIn) return;
    this.setState({ validationError: false });
    const { saleTime, requestCid } = this.state;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    if (!requestCid) return;
    const choiceArgs = { 
      transportId: generateGuid(),
      recordId: generateGuid(),
      recordTime: ledgerDate(saleTime)
    };
    ledger.exercise(SaleRequest.AcceptSaleRequest, requestCid, choiceArgs)
      .then(() => this.onClose());
  }

  private onClose = () => {
    this.setState({ validationError: false });
    this.props.onClose();
  }

  private onOkay = () => {
    const { accept, saleTime } = this.state;
    const { product } = this.props;
    if (!accept) {
      this.putDeclineToLedger();
    } else if (truthyFields({ saleTime }) && endAfterStart({ startTime: product.lastUpdated, endTime: saleTime })) {
      this.putAcceptToLedger();
    }
    else this.setState({ validationError: true });
  }
  
  renderInputs() {
    const { user, product } = this.props;
    const { validationError, accept, request, saleTime } = this.state;
    if (!user.loggedIn || !request) return null
    return (
      <>
        <SaleAcceptEditHeader product={product} request={request}/>
        <AcceptDecline accept={accept} onChange={value => this.setState({  ...this.state, accept: value })}/>
        <DateTimeInput
          label="Sale Time"
          onChange={value => this.setState({ ...this.state, saleTime: value })}
          value={saleTime}
          disabled={!accept}
          error={validationError && (!saleTime || !endAfterStart({ startTime: product.lastUpdated, endTime: saleTime }))}
          errorMessage={(validationError && !endAfterStart({ startTime: product.lastUpdated, endTime: saleTime })) ? "Must be after " + uiDate(product.lastUpdated) + " (last record time)" : undefined}
        />
      </>
    );
  }
  
  render() {
    return (
      <InputDialog
        title="Review Offer"
        children={this.renderInputs()}
        open={this.props.open}
        onOkay={this.onOkay}
        onCancel={this.onClose}
        onEnter={() => this.setState(this.initialState())}
      />
    );
  }
}
