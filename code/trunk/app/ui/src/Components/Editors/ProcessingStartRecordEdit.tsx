import React from "react";
import { TextInput } from "../../Components/Input/TextInput";
import { DateTimeInput } from "../../Components/Input/DateTimeInput";
import { AutocompleteInput } from "../../Components/Input/AutocompleteInput";
import { InputDialog } from "../../Components/Input/InputDialog";
import { ProductType, recipesFor } from "../../Types/ProductType";
import { emptyLocation } from "../../Types/Location";
import { endAfterStart } from "../../Utils/EndAfterStart";
import Ledger from "@daml/ledger";
import { httpBaseUrl, wsBaseUrl } from "../../config";
import { UserState } from "../../Redux/State/UserState";
import { Product } from "@daml.js/app-0.0.1/lib/Product";
import { Location } from "@daml.js/app-0.0.1/lib/Types";
import { getProductKey } from "../../Types/Product";
import { ProcessingStartRecordEditHeader } from "../DataDisplay/EditHeaders/ProcessingStartRecordEditHeader";
import { uiDate, newEditDate, ledgerDate } from "../../Utils/DateFormat";
import { truthyFields } from "../../Utils/TruthyFields";
import { generateGuid } from "../../Utils/GenerateGuid";

interface ProcessingStartRecordEditProps {
  open: boolean;
  onClose: () => void;
  user: UserState;
  product: Product;
}

interface ProcessingStartRecordEditState {
  editState: EditState;
  validationError: boolean;
}

interface EditState {
  outputType: ProductType | undefined;
  location: Location;
  startTime: string;
}

export class ProcessingStartRecordEdit extends React.Component<ProcessingStartRecordEditProps, ProcessingStartRecordEditState> {
  constructor(props: ProcessingStartRecordEditProps) {
    super(props);
    this.state = this.initialState(props);
  }

  initialState(props: ProcessingStartRecordEditProps): ProcessingStartRecordEditState {
    return {
      validationError: false,
      editState: {
        outputType: undefined,
        location: props.user.loggedIn && !!props.user.location ? props.user.location : emptyLocation,
        startTime: newEditDate()
      }
    }
  }
  
  private putToLedger = () => {
    if (!this.props.user.loggedIn) return;
    this.setState({ validationError: false });
    const { product } = this.props;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    const productKey = getProductKey(product);

    const choiceArgs = {
      processId: generateGuid(),
      recordId: generateGuid(),
      recordProcessor: this.props.user.username,
      recordStartTime: ledgerDate(this.state.editState.startTime),
      recordLocation: this.state.editState.location,
      outputType: !!this.state.editState.outputType ? this.state.editState.outputType.identifier : ""
    };

    ledger.exerciseByKey(Product.AddStartProcessingRecordToProduct, productKey, choiceArgs)
      .then(() => this.onClose());
  }

  private onOkay = () => {
    const { editState } = this.state;
    const { product } = this.props;
    if (truthyFields(editState) && endAfterStart({ startTime: product.lastUpdated, endTime: editState.startTime })) this.putToLedger();
    else this.setState({ validationError: true });
  }
  
  private onClose = () => {
    this.setState({ validationError: false });
    this.props.onClose();
  }

  private updateEditState(partial: Partial<EditState>) {
    this.setState({ ...this.state, editState: { ...this.state.editState, ...partial } });
  }
  
  renderInputs() {
    const { user, product } = this.props;
    const { validationError } = this.state;
    if (!user.loggedIn) return null;
    return (
      <>
        <ProcessingStartRecordEditHeader product={product} />
        <AutocompleteInput<ProductType>
          label="Output Product Type"
          options={recipesFor(product.productInfo.typeId)}
          onChange={outputType => this.updateEditState({ outputType })}
          getOptionLabel={(option) => option.name}
          error={validationError && !this.state.editState.outputType}
          errorMessage={validationError && recipesFor(product.productInfo.typeId).length === 0 ? "No recipes for input product" : ""}
        />
        <TextInput
          label="Location Name"
          onChange={name => this.updateEditState({ location: { ...this.state.editState.location, name }})}
          error={validationError && !this.state.editState.location.name}
          value={user.loggedIn && !!user.location ? user.location.name : this.state.editState.location.name}
          disabled={user.loggedIn && !!user.location}
        />
        <TextInput
          label="Country"
          onChange={country => this.updateEditState({ location: { ...this.state.editState.location, country }})}
          error={validationError && !this.state.editState.location.country}
          value={user.loggedIn && !!user.location ? user.location.country : this.state.editState.location.country}
          disabled={user.loggedIn && !!user.location}
        />
        <DateTimeInput
          label="Start Time"
          value={this.state.editState.startTime}
          onChange={startTime => this.updateEditState({ startTime })}
          error={validationError && (!this.state.editState.startTime || !endAfterStart({ startTime: product.lastUpdated, endTime: this.state.editState.startTime }))}
          errorMessage={(validationError && !endAfterStart({ startTime: product.lastUpdated, endTime: this.state.editState.startTime })) ? "Must be after " + uiDate(product.lastUpdated) + " (last record time)" : undefined}
        />
      </>
    );
  }
  
  render() {
    return (
      <InputDialog
        title="Start Processing"
        children={this.renderInputs()}
        open={this.props.open}
        onOkay={this.onOkay}
        onCancel={this.onClose}
        onEnter={() => this.setState(this.initialState(this.props))}
      />
    );
  }
}
