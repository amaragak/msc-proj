import React from "react";
import { SimpleTable } from "../DataDisplay/Tables/SimpleTable";
import { ProcessingStartRecord } from "../../Types/ProcessingRecord";
import { productTypeFromId } from "../../Types/ProductType";
import { uiDate } from "../../Utils/DateFormat";
import { Amount } from "../DataDisplay/NumberFormatting/Amount";

interface ProcessingStartResultProps {
  record: ProcessingStartRecord;
}

export class ProcessingStartResult extends React.Component<ProcessingStartResultProps, {}> {
  render() {
    const { record } = this.props;
    return (
      <SimpleTable
        title="Process Start"
        rows={[
          {
            field: "Input Product",
            value: "",
            header: true
          },
          {
            field: "Type",
            value: productTypeFromId(record.inputProduct.typeId).name
          },
          {
            field: "Label(s)",
            value: record.inputProduct.labels.join(", ")
          },
          {
            field: "Amount",
            renderValue: () => <Amount unit={record.inputProduct.amount.unit} quantity={record.inputProduct.amount.quantity}/>
          },
          undefined,
          {
            field: "Details",
            value: "",
            header: true
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
            field: "Start Time",
            value: uiDate(record.startTime)
          }
        ]}
      />
    );
  }
}

