import React from "react";
import { ProductAuditRecord } from "./ProductAuditRecord";
import { TransportationRecord } from "../../../Types/TransportationRecord";
import { productTypeFromId } from "../../../Types/ProductType";
import { uiDate } from "../../../Utils/DateFormat";

interface TransportationEndResultProps {
  record: TransportationRecord;
}

export class TransportationEndResult extends React.Component<TransportationEndResultProps, {}> {
  render() {
    const { record } = this.props;
    return (
      <ProductAuditRecord
        title="Transportation End"
        rows={[
          {
            field: "Transporter",
            value: record.actor
          },
          {
            field: "Product",
            value: productTypeFromId(record.product.typeId).name
          },
          {
            field: "Label" + (record.product.labels.length > 1 ? "s" : ""),
            value: record.product.labels.join(", ")
          },
          {
            field: "Amount",
            value: record.product.amount.quantity + " " + record.product.amount.unit
          },
          {
            field: "End Location",
            value: record.endLocation.name + ", " + record.endLocation.country
          },
          {
            field: "End Time",
            value: uiDate(record.endTime)
          }
        ]}
      />
    );
  }
}

