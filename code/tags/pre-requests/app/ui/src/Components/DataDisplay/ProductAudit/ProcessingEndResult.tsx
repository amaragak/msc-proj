import React from "react";
import { ProductAuditRecord } from "./ProductAuditRecord";
import { ProcessingRecord } from "../../../Types/ProcessingRecord";
import { productTypeFromId } from "../../../Types/ProductType";
import { uiDate } from "../../../Utils/DateFormat";

interface ProcessingEndResultProps {
  record: ProcessingRecord;
}

export class ProcessingEndResult extends React.Component<ProcessingEndResultProps, {}> {
  render() {
    const { record } = this.props;
    return (
      <ProductAuditRecord
        title="Process End"
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
            field: "Output Product",
            value: productTypeFromId(record.outputProduct.typeId).name
          },
          {
            field: "Output Label",
            value: record.outputProduct.labels[0]
          },
          {
            field: "Output Amount",
            value: record.outputProduct.amount.quantity + " " + record.outputProduct.amount.unit
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

