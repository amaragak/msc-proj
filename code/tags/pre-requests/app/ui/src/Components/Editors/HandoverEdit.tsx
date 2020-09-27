import React from "react";
import { AutocompleteInput } from "../../Components/Input/AutocompleteInput";
import { DateTimeInput } from "../../Components/Input/DateTimeInput";
import { InputDialog } from "../../Components/Input/InputDialog";
import { UserInfo, Users } from "../../Types/UserInfo";
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
  
  private putToLedger = async () => {
    if (!this.props.user.loggedIn) return;
    const { product } = this.props;
    const { record } = this.state;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    const productKey = getProductKey(product);
    const choiceArgs = handoverRecordToChoiceArgs(record);
    await ledger.exerciseByKey(Product.AddHandoverRecordToProduct, productKey, choiceArgs);
    this.onClose();
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

  private onOkay = async () => {
    const { record } = this.state;
    if (validateHandoverRecord(record)) this.putToLedger();
    else this.setState({ validationError: true });
  }
  
  renderInputs() {
    const { user } = this.props;
    const { validationError, record } = this.state;
    if (!user.loggedIn) return null
    return (
      <>
        <AutocompleteInput<UserInfo>
          label="New Handler"
          options={Users}
          onChange={value => this.updateRecord(record => record.newHandler = value.username)}
          getOptionLabel={option => option.username}
          error={validationError && !record.newHandler}
        />
        <DateTimeInput
          label="Time"
          value={record.time}
          onChange={value => this.updateRecord(record => record.time = value)}
          error={validationError && !record.time}
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
        onCancel={this.onClose} />
    );
  }
}
