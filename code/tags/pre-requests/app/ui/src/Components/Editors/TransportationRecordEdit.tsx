import React from "react";
import { TextInput } from "../../Components/Input/TextInput";
import { DateTimeInput } from "../../Components/Input/DateTimeInput";
import { InputDialog } from "../../Components/Input/InputDialog";
import { emptyTransportationRecord, transportationRecordToChoiceArgs, validateTransportationRecord, transportationRecordToRecord, TransportationRecord } from "../../Types/TransportationRecord";
import { endAfterStart } from "../../Utils/EndAfterStart";
import { httpBaseUrl, wsBaseUrl } from "../../config";
import { UserState } from "../../Redux/State/UserState";
import Ledger from "@daml/ledger";
import { Product } from "@daml.js/app-0.0.1/lib/Product";
import { getProductKey } from "../../Types/Product";
import { TransportationRecordEditHeader } from "../DataDisplay/ProductAudit/TransportationRecordEditHeader";
import { uiDate } from "../../Utils/DateFormat";

export interface TransportationRecordEditProps {
  open: boolean;
  onClose: () => void;
  product: Product;
  user: UserState;
}

interface TransportationRecordEditState {
  record: TransportationRecord;
  validationError: boolean;
}

export class TransportationRecordEdit extends React.Component<TransportationRecordEditProps, TransportationRecordEditState> {
  constructor(props: TransportationRecordEditProps) {
    super(props);
    this.state = { record: emptyTransportationRecord(props.product), validationError: false };
  }
  
  private putToLedger = async () => {
    if (!this.props.user.loggedIn) return;
    const { product } = this.props;
    const { record } = this.state;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    const productKey = getProductKey(product);
    const choiceArgs = transportationRecordToChoiceArgs(record);
    await ledger.exerciseByKey(Product.AddTransportationRecordToProduct, productKey, choiceArgs);
    this.onClose();
  }

  private onClose = () => {
    this.setState({ validationError: false });
    this.props.onClose();
  }

  private updateRecord(updateMember: (record: TransportationRecord) => void) {
    let record: TransportationRecord = { ...this.state.record };
    updateMember(record);
    this.setState({ record });
  }

  private onOkay = async () => {
    const { record } = this.state;
    if (validateTransportationRecord(record)) this.putToLedger();
    else this.setState({ validationError: true });
  }
  
  renderInputs() {
    const { user, product } = this.props;
    const { validationError, record } = this.state;
    if (!user.loggedIn) return null;
    return (
      <>
        <TransportationRecordEditHeader record={record}/>
        <TextInput
          label="Start Location Name"
          onChange={value => this.updateRecord(record => record.startLocation.name = value)}
          error={validationError && !record.startLocation.name}
        />
        <TextInput
          label="Start Country"
          onChange={value => this.updateRecord(record => record.startLocation.country = value)}
          error={validationError && !record.startLocation.country}
        />
        <DateTimeInput
          label="Start Time"
          value={record.startTime}
          onChange={value => this.updateRecord(record => record.startTime = value)}
          error={validationError && (!record.startTime || !endAfterStart({ startTime: product.lastUpdated, endTime: record.startTime }))}
          errorMessage={(validationError && !endAfterStart({ startTime: product.lastUpdated, endTime: record.startTime })) ? "Start time must be after " + uiDate(product.lastUpdated) + " (last record time)" : undefined}
        />
         <TextInput
          label="End Location Name"
          onChange={value => this.updateRecord(record => record.endLocation.name = value)}
          error={validationError && !record.endLocation.name}
        />
        <TextInput
          label="End Country"
          onChange={value => this.updateRecord(record => record.endLocation.country = value)}
          error={validationError && !record.endLocation.country}
        />
        <DateTimeInput
          label="End Time"
          value={record.endTime}
          onChange={value => this.updateRecord(record => record.endTime = value)}
          error={validationError && (!record.endTime || !endAfterStart({ startTime: record.startTime, endTime: record.endTime }))}
          errorMessage={(validationError && !endAfterStart({ startTime: record.startTime, endTime: record.endTime })) ? "End time must be after start time" : undefined}
        />
      </>
    );
  }
  
  render() {
    return (
      <InputDialog
        title="Create Transportation Record"
        children={this.renderInputs()}
        open={this.props.open}
        onOkay={this.onOkay}
        onCancel={this.onClose} />
    );
  }
}
