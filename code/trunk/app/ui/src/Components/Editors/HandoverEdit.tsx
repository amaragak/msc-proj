import React from "react";
import { AutocompleteInput } from "../../Components/Input/AutocompleteInput";
import { DateTimeInput } from "../../Components/Input/DateTimeInput";
import { InputDialog } from "../../Components/Input/InputDialog";
import { UserInfo, Users } from "../../Types/UserInfo";
import { endAfterStart } from "../../Utils/EndAfterStart";
import { uiDate } from "../../Utils/DateFormat";
import { UserState } from "../../Redux/State/UserState";
import Ledger from "@daml/ledger";
import { httpBaseUrl, wsBaseUrl } from "../../config";
import { Product } from "@daml.js/app-0.0.1/lib/Product";
import { HandoverRecord, validateHandoverRecord, emptyHandoverRecord, handoverRecordToChoiceArgs } from "../../Types/HandoverRecord";
import { getProductKey } from "../../Types/Product";

interface HandoverEditProps {
  open: boolean;
  onClose: () => void;
  user: UserState;
  product: Product;
}

interface HandoverEditState {
  record: HandoverRecord;
  validationError: boolean;
}

export class HandoverEdit extends React.Component<HandoverEditProps, HandoverEditState> {
  constructor(props: HandoverEditProps) {
    super(props);
    this.state = { record: emptyHandoverRecord(props.product), validationError: false };
  }
  
  private putToLedger = () => {
    if (!this.props.user.loggedIn) return;
    this.setState({ validationError: false });
    const { product } = this.props;
    const { record } = this.state;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    const productKey = getProductKey(product);
    const choiceArgs = handoverRecordToChoiceArgs(record);
    ledger.exerciseByKey(Product.AddHandoverRecordToProduct, productKey, choiceArgs)
      .then(() => this.onClose());
  }

  private updateRecord(updateMember: (record: HandoverRecord) => void) {
    let record: HandoverRecord = { ...this.state.record };
    updateMember(record);
    this.setState({ record });
  }

  private onClose = () => {
    this.setState({ validationError: false });
    this.props.onClose();
  }

  private onOkay = () => {
    const { record } = this.state;
    const { product } = this.props;
    if (validateHandoverRecord(record, product)) this.putToLedger();
    else this.setState({ validationError: true });
  }
  
  renderInputs() {
    const { user, product } = this.props;
    const { validationError, record } = this.state;
    if (!user.loggedIn) return null
    return (
      <>
        <AutocompleteInput<UserInfo>
          label="New Handler"
          options={Users}
          onChange={value => this.updateRecord(record => record.newHandler = value ? value.username : "")}
          getOptionLabel={option => option.username}
          error={validationError && !record.newHandler}
        />
        <DateTimeInput
          label="Time"
          value={record.time}
          onChange={value => this.updateRecord(record => record.time = value)}
          error={validationError && (!record.time || !endAfterStart({ startTime: product.lastUpdated, endTime: record.time }))}
          errorMessage={(validationError && !endAfterStart({ startTime: product.lastUpdated, endTime: record.time })) ? "Must be after " + uiDate(product.lastUpdated) + " (last record time)" : undefined}
        />
      </>
    );
  }
  
  render() {
    return (
      <InputDialog
        title="Product Handover"
        children={this.renderInputs()}
        open={this.props.open}
        onOkay={this.onOkay}
        onCancel={this.onClose}
        onEnter={() => this.setState({ record: emptyHandoverRecord(this.props.product), validationError: false })}
      />
    );
  }
}
