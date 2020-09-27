import React from "react";
import { AutocompleteInput } from "../../Components/Input/AutocompleteInput";
import { InputDialog } from "../../Components/Input/InputDialog";
import { UserInfo, Users } from "../../Types/UserInfo";
import { UserState } from "../../Redux/State/UserState";
import Ledger from "@daml/ledger";
import { httpBaseUrl, wsBaseUrl } from "../../config";
import { Product } from "@daml.js/app-0.0.1/lib/Product";
import { getProductKey } from "../../Types/Product";
import { HandoverRequestEditHeader } from "../DataDisplay/EditHeaders/HandoverRequestEditHeader"

interface HandoverRequestEditProps {
  open: boolean;
  onClose: () => void;
  user: UserState;
  product: Product;
  onlyToOwner?: boolean;
}

interface HandoverRequestEditState {
  newHandler: string;
  validationError: boolean;
}

export class HandoverRequestEdit extends React.Component<HandoverRequestEditProps, HandoverRequestEditState> {
  constructor(props: HandoverRequestEditProps) {
    super(props);
    this.state = this.initialState(props);
  }

  private initialState(props: HandoverRequestEditProps): HandoverRequestEditState {
    return {
      newHandler: props.onlyToOwner ? props.product.owner : "",
      validationError: false
    }
  }
  
  private putToLedger = () => {
    if (!this.props.user.loggedIn) return;
    this.setState({ validationError: false });
    const { product } = this.props;
    const { newHandler } = this.state;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    const productKey = getProductKey(product);
    const choiceArgs = { newHandler }
    ledger.exerciseByKey(Product.MakeHandoverRequest, productKey, choiceArgs)
      .then(() => this.onClose());
  }

  private onClose = () => {
    this.setState({ validationError: false });
    this.props.onClose();
  }

  private onOkay = () => {
    if (!!this.state.newHandler) this.putToLedger();
    else this.setState({ validationError: true });
  }
  
  renderInputs() {
    const { user, product } = this.props;
    const { validationError, newHandler } = this.state;
    if (!user.loggedIn) return null
    return (
      <>
        <HandoverRequestEditHeader product={product}/>
        {!this.props.onlyToOwner && <AutocompleteInput<UserInfo>
          label="New Handler"
          options={Users.filter(u => u.username !== user.username)}
          onChange={value => this.setState({ ...this.state, newHandler: value && value.username })}
          getOptionLabel={option => option.username}
          error={validationError && !newHandler}
        />}
      </>
    );
  }
  
  render() {
    return (
      <InputDialog
        title={this.props.onlyToOwner ? "Request Handover To Owner" :  "Request Handover"}
        children={this.renderInputs()}
        open={this.props.open}
        onOkay={this.onOkay}
        onCancel={this.onClose}
        onEnter={() => this.setState(this.initialState(this.props))}
      />
    );
  }
}
