import React from "react";
import { AutocompleteInput } from "../../Components/Input/AutocompleteInput";
import { InputDialog } from "../../Components/Input/InputDialog";
import { TextInput } from "../../Components/Input/TextInput";
import { UserInfo, Users, UserRole, hasRole } from "../../Types/UserInfo";
import { recipesFor, ProductType } from "../../Types/ProductType";
import { UserState } from "../../Redux/State/UserState";
import Ledger from "@daml/ledger";
import { httpBaseUrl, wsBaseUrl } from "../../config";
import { Product } from "@daml.js/app-0.0.1/lib/Product";
import { getProductKey } from "../../Types/Product";
import { truthyFields } from "../../Utils/TruthyFields";
import { ProcessingRequestEditHeader } from "../DataDisplay/EditHeaders/ProcessingRequestEditHeader";
import { emptyLocation } from "../../Types/Location";

interface ProcessingRequestEditProps {
  open: boolean;
  onClose: () => void;
  user: UserState;
  product: Product;
}

interface ProcessingRequestEditState {
  request: ProcessingRequest;
  validationError: boolean;
}

interface ProcessingRequest {
  processor: UserInfo | undefined;
  productType: ProductType | undefined;
  locationName: string;
  country: string;
}

const emptyRequest: ProcessingRequest = { 
  processor: undefined, 
  productType: undefined,
  locationName: "",
  country: ""
};

export class ProcessingRequestEdit extends React.Component<ProcessingRequestEditProps, ProcessingRequestEditState> {
  constructor(props: ProcessingRequestEditProps) {
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
      processor: !!request.processor ? request.processor.username : "",
      outputType: request.productType?.identifier,
      location: {
        name: request.locationName,
        country: request.country
      }
    };
    ledger.exerciseByKey(Product.MakeProcessingRequest, productKey, choiceArgs)
      .then(() => this.onClose());
  }

  private onClose = () => {
    this.setState({ validationError: false });
    this.props.onClose();
  }

  private onOkay = () => {
    const { request } = this.state;
    const { processor, ...toValidate } = request;
    if (truthyFields({ toValidate, processor: processor?.username })) this.putToLedger();
    else this.setState({ validationError: true });
  }
  
  renderInputs() {
    const { user, product } = this.props;
    const { validationError, request } = this.state;
    if (!user.loggedIn) return null
    return (
      <>
        <ProcessingRequestEditHeader product={product} />
        <AutocompleteInput<UserInfo>
          label="Processor"
          options={Users.filter(u => user.username !== u.username && hasRole(u, [UserRole.ADMIN, UserRole.PROCESSOR]))}
          onChange={value => {
            let newLocation = { name: request.locationName, country: request.country };
            if (request.processor && request.processor.location && !value) {
              newLocation = emptyLocation;
            } else if (value && value.location){
              newLocation = {
                name: value.location.name,
                country: value.location.country
              };
            }
            this.setState({ 
              ...this.state, 
              request: { 
                ...request, 
                processor: value,
                locationName: newLocation.name,
                country: newLocation.country,
              } 
            })
          }}
          getOptionLabel={option => option.username}
          error={validationError && !request.processor}
        />
        <TextInput
          label="Location Name"
          onChange={value => this.setState({ ...this.state, request: {  ...request, locationName: value } })}
          error={validationError && !request.locationName}
          value={request.locationName}
          disabled={!!request.processor && !!request.processor.location}
        />
        <TextInput
          label="Country"
          onChange={value => this.setState({ ...this.state, request: {  ...request, country: value } })}
          error={validationError && !request.country}
          value={request.country}
          disabled={!!request.processor && !!request.processor.location}
        />
        <AutocompleteInput<ProductType>
          label="Output Product Type"
          options={recipesFor(product.productInfo.typeId)}
          onChange={value => this.setState({ ...this.state, request: { ...request, productType: value } })}
          getOptionLabel={(option) => option.name}
          error={validationError && !request.productType}
          errorMessage={validationError && recipesFor(product.productInfo.typeId).length === 0 ? "No recipes for input product" : ""}
        />
      </>
    );
  }
  
  render() {
    return (
      <InputDialog
        title="Request Processing"
        children={this.renderInputs()}
        open={this.props.open}
        onOkay={this.onOkay}
        onCancel={this.onClose}
        onEnter={() => this.setState({ request: emptyRequest, validationError: false })}
      />
    );
  }
}
