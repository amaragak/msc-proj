import React from "react";
import { ProductAuditRecord } from "./ProductAuditRecord";
import { ProcessingRecord } from "../../../Types/ProcessingRecord";
import { productTypeFromId } from "../../../Types/ProductType";

interface ProcessingRecordEditHeaderProps {
  record: ProcessingRecord;
}

export class ProcessingRecordEditHeader extends React.Component<ProcessingRecordEditHeaderProps, {}> {
  render() {
    const { record } = this.props;
    return (
      <ProductAuditRecord
        rows={[
          {
            field: "Processor",
            value: record.actor
          },
          {
            field: "Input Product",
            value: productTypeFromId(record.inputProduct.typeId).name
          },
          {
            field: "Input Labels",
            value: record.inputProduct.labels.join(", ")
          },
          {
            field: "Input Amount",
            value: record.inputProduct.amount.quantity + " " + record.inputProduct.amount.unit
          }
        ]}
      />
    );
  }
}

