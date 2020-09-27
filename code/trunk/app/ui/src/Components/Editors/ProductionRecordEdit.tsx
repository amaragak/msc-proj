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
import { uiDate } from "../../Utils/DateFormat";
import { endAfterStart } from "../../Utils/EndAfterStart";
import { validateNumericString } from "../../Utils/ValidateNumericString";
import { ProductionRecordEditHeader } from "../DataDisplay/EditHeaders/ProductionRecordEditHeader";

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
    this.state = { record: emptyProductionRecord(props.product, props.user), validationError: false };
  }

  private putToLedger = () => {
    this.setState({ validationError: false });
    if (!this.props.user.loggedIn) return;
    const { product } = this.props;
    const { record } = this.state;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    const productKey = getProductKey(product);
    const choiceArgs = productionRecordToChoiceArgs(record);
    ledger.exerciseByKey(Product.AddProductionRecordToProduct, productKey, choiceArgs)
      .then(() => this.onClose());
  }

  private onClose = () => {
    this.props.onClose();
  }

  private updateRecord(updateMember: (record: ProductionRecord) => void) {
    let record: ProductionRecord = { ...this.state.record };
    updateMember(record);
    this.setState({ record });
  }

  private onOkay = () => {
    const { record } = this.state;
    const { product } = this.props;
    if (validateProductionRecord(record, product)) this.putToLedger();
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
          value={record.product.labels[0]}
          disabled={true}
        />
        <AmountInput
          onChangeQuantity={value => this.updateRecord(record => record.product.amount.quantity = value)}
          onChangeUnit={(value) => {}}
          unitOptions={["kg", "litres"]}
          unit={unitToString(productTypeFromId(product.productInfo.typeId).unit)}
          quantityLabel="Quantity"
          unitLabel="Unit"
          unitDisabled={true}
          quantityError={validationError && (!record.product.amount.quantity || !validateNumericString(record.product.amount.quantity))}
          unitError={false}
        />
        <AutocompleteInput<Plot>
          label="Plot"
          onChange={value => this.updateRecord(record => record.plotId = value ? value.identifier : "")}
          error={validationError && !record.plotId}
          options={plotsForUser(user.username)}
          getOptionLabel={plot => "Plot " + plot.plotNumber + " - (" + plot.farmer + ")"}
        />
        <TextInput
          label="Location Name"
          onChange={value => this.updateRecord(record => record.location.name = value)}
          error={validationError && !record.location.name}
          value={user.loggedIn && !!user.location ? user.location.name : record.location.name}
          disabled={user.loggedIn && !!user.location}
        />
        <TextInput
          label="Country"
          onChange={value => this.updateRecord(record => record.location.country = value)}
          error={validationError && !record.location.country}
          value={user.loggedIn && !!user.location ? user.location.country : record.location.country}
          disabled={user.loggedIn && !!user.location}
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
        title="Add Production Record"
        children={this.renderInputs()}
        open={this.props.open}
        onOkay={this.onOkay}
        onCancel={this.onClose}
        onEnter={() => this.setState({ record: emptyProductionRecord(this.props.product, this.props.user), validationError: false })}
      />
    );
  }
}
