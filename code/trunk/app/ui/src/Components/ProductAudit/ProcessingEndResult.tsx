import React from "react";
import { SimpleTable } from "../DataDisplay/Tables/SimpleTable";
import { ProcessingEndRecord } from "../../Types/ProcessingRecord";
import { productTypeFromId } from "../../Types/ProductType";
import { uiDate } from "../../Utils/DateFormat";
import { Amount } from "../DataDisplay/NumberFormatting/Amount";

interface ProcessingEndResultProps {
  record: ProcessingEndRecord;
}

export class ProcessingEndResult extends React.Component<ProcessingEndResultProps, {}> {
  render() {
    const { record } = this.props;
    return (
      <SimpleTable
        title="Process End"
        rows={[
          {
            field: "Output Product",
            value: "",
            header: true
          },
          {
            field: "Product",
            value: productTypeFromId(record.outputProduct.typeId).name
          },
          {
            field: "Label",
            value: record.outputProduct.labels[0]
          },
          {
            field: "Amount",
            renderValue: () => <Amount quantity={record.outputProduct.amount.quantity} unit={record.outputProduct.amount.unit}/>
          },
          undefined,
          {
            field: "Details"
          },
          {
            field: "Processor",
            value: record.actor
          },
          {
            field: "Location",
            value: record.location.name + ", " + record.location.country
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

