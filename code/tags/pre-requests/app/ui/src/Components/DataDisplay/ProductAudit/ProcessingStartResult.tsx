import React from "react";
import { ProductAuditRecord } from "./ProductAuditRecord";
import { ProcessingRecord } from "../../../Types/ProcessingRecord";
import { productTypeFromId } from "../../../Types/ProductType";
import { uiDate } from "../../../Utils/DateFormat";

interface ProcessingStartResultProps {
  record: ProcessingRecord;
}

export class ProcessingStartResult extends React.Component<ProcessingStartResultProps, {}> {
  render() {
    const { record } = this.props;
    return (
      <ProductAuditRecord
        title="Process Start"
        rows={[
          {
            field: "Processor",
            value: record.actor
          },
          {
            field: "Location",
            value: record.location.name + ", " + record.location.country
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

