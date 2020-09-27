import React from "react";
import { SimpleTable } from "../Tables/SimpleTable";
import { ProcessingRecord } from "../../../Types/ProcessingRecord";
import { productTypeFromId } from "../../../Types/ProductType";
import { Amount } from "../NumberFormatting/Amount";

interface ProcessingRecordEditHeaderProps {
  record: ProcessingRecord;
}

export class ProcessingRecordEditHeader extends React.Component<ProcessingRecordEditHeaderProps, {}> {
  render() {
    const { record } = this.props;
    return (
      <SimpleTable
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
            renderValue: () => <Amount quantity={record.inputProduct.amount.quantity} unit={record.inputProduct.amount.unit}/>
          }
        ]}
      />
    );
  }
}

