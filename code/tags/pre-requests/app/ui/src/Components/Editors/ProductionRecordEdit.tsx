import React from "react";
import { TextInput } from "../../Components/Input/TextInput";
import { DateTimeInput } from "../../Components/Input/DateTimeInput";
import { AmountInput } from "../../Components/Input/AmountInput";
import { AutocompleteInput } from "../../Components/Input/AutocompleteInput";
import { InputDialog } from "../../Components/Input/InputDialog";
import { productTypeFromId, unitToString } from "../../Types/ProductType";
import { emptyProductionRecord, productionRecordToChoiceArgs, validateProductionRecord, ProductionRecord } from "../../Types/ProductionRecord";
import { plotsForUser, Plot } from "../../Types/Plot";
import { UserState } from "../../Redux/State/UserState";
import Ledger from "@daml/ledger";
import { httpBaseUrl, wsBaseUrl } from "../../config";
import { Product } from "@daml.js/app-0.0.1/lib/Product";
import { getProductKey } from "../../Types/Product";
import { ProductionRecordEditHeader } from "../DataDisplay/ProductAudit/ProductionRecordEditHeader";

export interface ProductionRecordEditProps {
  open: boolean;
  onClose: () => void;
  user: UserState;
  product: Product;
}

interface ProductionRecordEditState {
  record: ProductionRecord;
  validationError: boolean;
}

export class ProductionRecordEdit extends React.Component<ProductionRecordEditProps, ProductionRecordEditState> {
  constructor(props: ProductionRecordEditProps) {
    super(props);
    this.state = { record: emptyProductionRecord(props.product), validationError: false };
  }

  private putToLedger = async () => {
    if (!this.props.user.loggedIn) return;
    const { product } = this.props;
    const { record } = this.state;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    const productKey = getProductKey(product);
    const choiceArgs = productionRecordToChoiceArgs(record);
    await ledger.exerciseByKey(Product.AddProductionRecordToProduct, productKey, choiceArgs);
    this.onClose();
  }

  private onClose = () => {
    this.setState({ validationError: false });
    this.props.onClose();
  }

  private updateRecord(updateMember: (record: ProductionRecord) => void) {
    let record: ProductionRecord = { ...this.state.record };
    updateMember(record);
    this.setState({ record });
  }

  private onOkay = async () => {
    const { record } = this.state;
    if (validateProductionRecord(record)) this.putToLedger();
    else this.setState({ validationError: true });
  }
  
  renderInputs() {
    const { user, product } = this.props;
    const { validationError, record } = this.state;
    if (!user.loggedIn) return null;
    return (
      <>
        <ProductionRecordEditHeader record={record} />
        <TextInput
          label="Label"
          onChange={value => this.updateRecord(record => record.product.labels = [value])}
          error={validationError && !record.product.labels[0]}
        />
        <AmountInput
          onChangeQuantity={value => this.updateRecord(record => record.product.amount.quantity = value)}
          onChangeUnit={(value) => {}}
          unitOptions={["kg", "litres"]}
          unit={unitToString(productTypeFromId(product.productType).unit)}
          quantityLabel="Quantity"
          unitLabel="Unit"
          unitDisabled={true}
          quantityError={validationError && !record.product.amount.quantity}
          unitError={false}
        />
        <AutocompleteInput<Plot>
          label="Plot Number"
          onChange={value => this.updateRecord(record => record.plotId = value.identifier)}
          error={validationError && !record.location.name}
          options={plotsForUser(user.username)}
          getOptionLabel={plot => "" + plot.plotNumber}
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
        title="Create Production Record"
        children={this.renderInputs()}
        open={this.props.open}
        onOkay={this.onOkay}
        onCancel={this.onClose} />
    );
  }
}
