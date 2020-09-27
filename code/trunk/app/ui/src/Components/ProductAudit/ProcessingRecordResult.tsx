import React from "react";
import { SimpleTable } from "../DataDisplay/Tables/SimpleTable";
import { ProcessingRecord } from "../../Types/ProcessingRecord";
import { productTypeFromId } from "../../Types/ProductType";
import { uiDate } from "../../Utils/DateFormat";

interface ProcessingRecordResultProps {
  record: ProcessingRecord;
}

export class ProcessingRecordResult extends React.Component<ProcessingRecordResultProps, {}> {
  render() {
    const { record } = this.props;
    return (
      <SimpleTable
        title="Process"
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
          },
          {
            field: "Start Time",
            value: uiDate(record.startTime)
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
          },
          {
            field: "Location",
            value: record.location.name + ", " + record.location.country
          }
        ]}
      />
    );
  }
}

