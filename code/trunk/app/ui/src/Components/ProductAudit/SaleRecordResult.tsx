import React from "react";
import { SimpleTable } from "../DataDisplay/Tables/SimpleTable";
import { SaleRecord } from "../../Types/SaleRecord";
import { uiDate } from "../../Utils/DateFormat";
import { Price } from "../DataDisplay/NumberFormatting/Price";
import { productTypeFromId } from "../../Types/ProductType";

interface SaleRecordResultProps {
  record: SaleRecord;
}

export class SaleRecordResult extends React.Component<SaleRecordResultProps, {}> {
  render() {
    const { record } = this.props;
    return (
      <SimpleTable
        title="Sale"
        rows={[
          {
            field: "Product",
            value: "",
            header: true
          },
          {
            field: "Product Type",
            value: productTypeFromId(record.product.typeId).name
          },
          {
            field: "Product Label(s)",
            value: record.product.labels.join(", ")
          },
          {
            field: "Amount",
            value: record.product.amount.quantity + " " + record.product.amount.unit
          },
          undefined,
          {
            field: "Details",
            value: "",
            header: true
          },
          {
            field: "Old Owner",
            value: record.actor
          },
          {
            field: "New Owner",
            value: record.buyer
          },
          {
            field: "Price",
            renderValue: () => <Price currency={record.currency} price={record.price} />
          },
          {
            field: "Time",
            value: uiDate(record.time)
          }
        ]}
      />
    );
  }
}

