import React from "react";
import { TextInput } from "../../Components/Input/TextInput";
import { DateTimeInput } from "../../Components/Input/DateTimeInput";
import { AmountInput } from "../../Components/Input/AmountInput";
import { AutocompleteInput } from "../../Components/Input/AutocompleteInput";
import { InputDialog } from "../../Components/Input/InputDialog";
import { ProductType, ProcessedProductTypes, unitToString } from "../../Types/ProductType";
import { emptyProcessingRecord, processingRecordToChoiceArgs, ProcessingRecord, validateProcessingRecord } from "../../Types/ProcessingRecord";
import { endAfterStart } from "../../Utils/EndAfterStart";
import Ledger from "@daml/ledger";
import { httpBaseUrl, wsBaseUrl } from "../../config";
import { UserState } from "../../Redux/State/UserState";
import { Product } from "@daml.js/app-0.0.1/lib/Product";
import { getProductKey } from "../../Types/Product";
import { ProcessingRecordEditHeader } from "../DataDisplay/ProductAudit/ProcessingRecordEditHeader";
import { uiDate } from "../../Utils/DateFormat";

interface ProcessingRecordEditProps {
  open: boolean;
  onClose: () => void;
  user: UserState;
  product: Product;
}

interface ProcessingRecordEditState {
  record: ProcessingRecord;
  validationError: boolean;
}

export class ProcessingRecordEdit extends React.Component<ProcessingRecordEditProps, ProcessingRecordEditState> {
  constructor(props: ProcessingRecordEditProps) {
    super(props);
    this.state = { record: emptyProcessingRecord(props.product), validationError: false };
  }
  
  private putToLedger = async () => {
    if (!this.props.user.loggedIn) return;
    const { product } = this.props;
    const { record } = this.state;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    const productKey = getProductKey(product);
    const choiceArgs = processingRecordToChoiceArgs(record);
    await ledger.exerciseByKey(Product.AddProcessingRecordToProduct, productKey, choiceArgs);
    this.onClose();
  }

  private updateRecord(updateMember: (record: ProcessingRecord) => void) {
    let record: ProcessingRecord = { ...this.state.record };
    updateMember(record);
    this.setState({ record });
  }

  private onOkay = async () => {
    const { record } = this.state;
    if (validateProcessingRecord(record)) this.putToLedger();
    else this.setState({ validationError: true });
  }
  
  private onClose = () => {
    this.setState({ validationError: false });
    this.props.onClose();
  }
  
  renderInputs() {
    const { user, product } = this.props;
    const { validationError, record } = this.state;
    if (!user.loggedIn) return null;
    return (
      <>
        <ProcessingRecordEditHeader record={record} />
        <AutocompleteInput<ProductType>
          label="Output Product Type"
          options={ProcessedProductTypes}
          onChange={value => this.updateRecord(record => {
            record.outputProduct.typeId = value && value.identifier;
            record.outputProduct.amount.unit = value && unitToString(value.unit);
          })}
          getOptionLabel={(option) => option.name}
          error={validationError && !record.outputProduct.typeId}
        />
        <TextInput
          label="Output Label"
          onChange={value => this.updateRecord(record => record.outputProduct.labels = [value])}
          error={validationError && !record.outputProduct.labels[0]}
        />
        <AmountInput
          onChangeQuantity={value => this.updateRecord(record => record.outputProduct.amount.quantity = value)}
          onChangeUnit={(value) => this.updateRecord(record => record.outputProduct.amount.unit = value)}
          unitOptions={["kg", "litres"]}
          unit={record.outputProduct.amount.unit}
          quantityLabel="Output Quantity"
          unitLabel="Unit"
          unitDisabled={true}
          quantityError={validationError && !record.outputProduct.amount.quantity}
          unitError={false}
        />
        <TextInput
          label="Location Name"
          onChange={value => this.updateRecord(record => record.location.name = value)}
          error={validationError && !record.location.name}
        />
        <TextInput
          label="Country"
          onChange={value => this.updateRecord(record => record.location.country = value)}
          error={validationError && !record.location.country}
        />
        <DateTimeInput
          label="Start Time"
          value={record.startTime}
          onChange={value => this.updateRecord(record => record.startTime = value)}
          error={validationError && (!record.startTime || !endAfterStart({ startTime: product.lastUpdated, endTime: record.startTime }))}
          errorMessage={(validationError && !endAfterStart({ startTime: product.lastUpdated, endTime: record.startTime })) ? "Start time must be after " + uiDate(product.lastUpdated) + " (last record time)" : undefined}
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
        title="Create Processing Record"
        children={this.renderInputs()}
        open={this.props.open}
        onOkay={this.onOkay}
        onCancel={this.onClose} />
    );
  }
}
