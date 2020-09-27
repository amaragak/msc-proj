import React from "react";
import { ProductAuditRecord } from "./ProductAuditRecord";
import { TransportationRecord } from "../../../Types/TransportationRecord";
import { productTypeFromId } from "../../../Types/ProductType";
import { uiDate } from "../../../Utils/DateFormat";

interface TransportationStartResultProps {
  record: TransportationRecord;
}

export class TransportationStartResult extends React.Component<TransportationStartResultProps, {}> {
  render() {
    const { record } = this.props;
    return (
      <ProductAuditRecord
        title="Transportation Start"
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
            field: "Start Location",
            value: record.startLocation.name + ", " + record.startLocation.country
          },
          {
            field: "Start Time",
            value: uiDate(record.startTime)
          }
        ]}
      />
    );
  }
}

