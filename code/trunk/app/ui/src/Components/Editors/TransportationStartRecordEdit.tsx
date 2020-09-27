import React from "react";
import { TextInput } from "../../Components/Input/TextInput";
import { DateTimeInput } from "../../Components/Input/DateTimeInput";
import { InputDialog } from "../../Components/Input/InputDialog";
import { endAfterStart } from "../../Utils/EndAfterStart";
import { httpBaseUrl, wsBaseUrl } from "../../config";
import { UserState } from "../../Redux/State/UserState";
import Ledger from "@daml/ledger";
import { Product } from "@daml.js/app-0.0.1/lib/Product";
import { getProductKey } from "../../Types/Product";
import { TransportationStartRecordEditHeader } from "../DataDisplay/EditHeaders/TransportationStartRecordEditHeader";
import { uiDate, newEditDate, ledgerDate } from "../../Utils/DateFormat";
import { emptyLocation } from "../../Types/Location";
import { Location } from "@daml.js/app-0.0.1/lib/Types";
import { generateGuid } from "../../Utils/GenerateGuid";
import { truthyFields } from "../../Utils/TruthyFields";

export interface TransportationStartRecordEditProps {
  open: boolean;
  onClose: () => void;
  product: Product;
  user: UserState;
}

interface TransportationStartRecordEditState {
  editState: EditState;
  validationError: boolean;
}

interface EditState {
  startLocation: Location;
  endLocation: Location;
  startTime: string;
}

export class TransportationStartRecordEdit extends React.Component<TransportationStartRecordEditProps, TransportationStartRecordEditState> {
  constructor(props: TransportationStartRecordEditProps) {
    super(props);
    this.state = this.initialState();
  }

  initialState(): TransportationStartRecordEditState {
    return {
      editState: {
        startLocation: emptyLocation,
        endLocation: emptyLocation,
        startTime: newEditDate()
      },
      validationError: false
    };
  }
  
  private putToLedger = () => {
    if (!this.props.user.loggedIn) return;
    this.setState({ validationError: false });
    const { product } = this.props;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    const productKey = getProductKey(product);
    const choiceArgs = {
      recordId: generateGuid(),
      recordTransporter: this.props.user.username,
      recordStartTime: ledgerDate(this.state.editState.startTime),
      recordStartLocation: this.state.editState.startLocation,
      endLocation: this.state.editState.endLocation
    }
    ledger.exerciseByKey(Product.AddStartTransportationRecordToProduct, productKey, choiceArgs)
      .then(() => this.onClose());
  }

  private onClose = () => {
    this.setState({ validationError: false });
    this.props.onClose();
  }

  private updateEditState(partial: Partial<EditState>) {
    this.setState({ ...this.state, editState: { ...this.state.editState, ...partial } });
  }

  private onOkay = () => {
    const { product } = this.props;
    const { editState } = this.state;
    if (truthyFields(editState) && endAfterStart({ startTime: product.lastUpdated, endTime: editState.startTime })) this.putToLedger();
    else this.setState({ validationError: true });
  }
  
  renderInputs() {
    const { user, product } = this.props;
    const { validationError } = this.state;
    if (!user.loggedIn) return null;
    return (
      <>
        <TransportationStartRecordEditHeader product={product}/>
        <TextInput
          label="Start Location Name"
          onChange={name => this.updateEditState({ startLocation: { ...this.state.editState.startLocation, name } })}
          error={validationError && !this.state.editState.startLocation.name}
        />
        <TextInput
          label="Start Country"
          onChange={country => this.updateEditState({ startLocation: { ...this.state.editState.startLocation, country } })}
          error={validationError && !this.state.editState.startLocation.country}
        />
         <TextInput
          label="End Location Name"
          onChange={name => this.updateEditState({ endLocation: { ...this.state.editState.endLocation, name } })}
          error={validationError && !this.state.editState.endLocation.name}
        />
        <TextInput
          label="End Country"
          onChange={country => this.updateEditState({ endLocation: { ...this.state.editState.endLocation, country } })}
          error={validationError && !this.state.editState.endLocation.country}
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
        title="Start Transportation"
        children={this.renderInputs()}
        open={this.props.open}
        onOkay={this.onOkay}
        onCancel={this.onClose}
        onEnter={() => this.setState(this.initialState())}
      />
    );
  }
}
