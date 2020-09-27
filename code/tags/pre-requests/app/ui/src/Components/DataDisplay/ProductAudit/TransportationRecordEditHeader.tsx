import React from "react";
import { ProductAuditRecord } from "./ProductAuditRecord";
import { TransportationRecord } from "../../../Types/TransportationRecord";
import { productTypeFromId } from "../../../Types/ProductType";

interface TransportationRecordEditHeaderProps {
  record: TransportationRecord;
}

export class TransportationRecordEditHeader extends React.Component<TransportationRecordEditHeaderProps, {}> {
  render() {
    const { record } = this.props;
    return (
      <ProductAuditRecord
        rows={[
          {
            field: "Transporter",
            value: record.actor
          },
          {
            field: "Product Type",
            value: productTypeFromId(record.product.typeId).name
          },
          {
            field: "Product Labels",
            value: record.product.labels.join(", ")
          },
          {
            field: "Amount",
            value: record.product.amount.quantity + " " + record.product.amount.unit
          }
        ]}
      />
    );
  }
}

