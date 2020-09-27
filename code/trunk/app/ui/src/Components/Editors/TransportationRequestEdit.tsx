import React from "react";
import { AutocompleteInput } from "../../Components/Input/AutocompleteInput";
import { InputDialog } from "../../Components/Input/InputDialog";
import { TextInput } from "../../Components/Input/TextInput";
import { UserInfo, Users, UserRole, hasRole } from "../../Types/UserInfo";
import { UserState } from "../../Redux/State/UserState";
import Ledger from "@daml/ledger";
import { httpBaseUrl, wsBaseUrl } from "../../config";
import { Product } from "@daml.js/app-0.0.1/lib/Product";
import { getProductKey } from "../../Types/Product";
import { truthyFields } from "../../Utils/TruthyFields";
import { TransportationRequestEditHeader } from "../DataDisplay/EditHeaders/TransportationRequestEditHeader";
import { emptyLocation } from "../../Types/Location";
import { Location } from "@daml.js/app-0.0.1/lib/Types";

interface TransportationRequestEditProps {
  open: boolean;
  onClose: () => void;
  user: UserState;
  product: Product;
}

interface TransportationRequestEditState {
  request: TransportationRequest;
  validationError: boolean;
}

interface TransportationRequest {
  transporter: UserInfo | undefined;
  startLocation: Location;
  endLocation: Location;
}

const emptyRequest: TransportationRequest = { 
  transporter: undefined, 
  startLocation: emptyLocation,
  endLocation: emptyLocation
};

export class TransportationRequestEdit extends React.Component<TransportationRequestEditProps, TransportationRequestEditState> {
  constructor(props: TransportationRequestEditProps) {
    super(props);
    this.state = { request: emptyRequest, validationError: false };
  }
  
  private putToLedger = () => {
    if (!this.props.user.loggedIn) return;
    this.setState({ validationError: false });
    const { product } = this.props;
    const { request } = this.state;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    const productKey = getProductKey(product);
    const choiceArgs = { 
      transporter: !!request.transporter ? request.transporter.username : "",
      startLocation: request.startLocation,
      endLocation: request.endLocation
    };
    ledger.exerciseByKey(Product.MakeTransportationRequest, productKey, choiceArgs)
      .then(() => this.onClose());
  }

  private onClose = () => {
    this.setState({ validationError: false });
    this.props.onClose();
  }

  private onOkay = () => {
    const { request } = this.state;
    const { transporter, ...minusTransporter } = request;
    if (truthyFields(minusTransporter) && transporter) this.putToLedger();
    else this.setState({ validationError: true });
  }
  
  renderInputs() {
    const { user, product } = this.props;
    const { validationError, request } = this.state;
    if (!user.loggedIn) return null
    return (
      <>
        <TransportationRequestEditHeader product={product} />
        <AutocompleteInput<UserInfo>
          label="Transporter"
          options={Users.filter(u => u.username !== user.username && hasRole(u, [UserRole.ADMIN, UserRole.TRANSPORTER]))}
          onChange={value => {
            this.setState({ 
              ...this.state, 
              request: { 
                ...request, 
                transporter: value
              } 
            })
          }}
          getOptionLabel={option => option.username}
          error={validationError && !request.transporter}
        />
        <TextInput
          label="Start Location Name"
          onChange={value => this.setState({ ...this.state, request: {  ...request, startLocation: { ...request.startLocation, name: value } } })}
          error={validationError && !request.startLocation.name}
        />
        <TextInput
          label="Start Location Country"
          onChange={value => this.setState({ ...this.state, request: {  ...request, startLocation: { ...request.startLocation, country: value } } })}
          error={validationError && !request.startLocation.country}
        />
        <TextInput
          label="End Location Name"
          onChange={value => this.setState({ ...this.state, request: {  ...request, endLocation: { ...request.endLocation, name: value } } })}
          error={validationError && !request.endLocation.name}
        />
        <TextInput
          label="End Location Country"
          onChange={value => this.setState({ ...this.state, request: {  ...request, endLocation: { ...request.endLocation, country: value } } })}
          error={validationError && !request.endLocation.country}
        />
      </>
    );
  }
  
  render() {
    return (
      <InputDialog
        title="Request Transportation"
        children={this.renderInputs()}
        open={this.props.open}
        onOkay={this.onOkay}
        onCancel={this.onClose}
        onEnter={() => this.setState({ request: emptyRequest, validationError: false })}
      />
    );
  }
}
