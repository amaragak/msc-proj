import React from "react";
import { SimpleTable } from "../DataDisplay/Tables/SimpleTable";
import { MergeRecord } from "../../Types/MergeRecord";
import { Amount } from "../DataDisplay/NumberFormatting/Amount";

interface MergeRecordResultProps {
  record: MergeRecord;
}

export class MergeRecordResult extends React.Component<MergeRecordResultProps, {}> {
  render() {
    const { record } = this.props;
    return (
      <SimpleTable
        title="Merge"
        rows={[
          {
            field: "Input A",
            value: "",
            header: true
          },
          {
            field: "Description",
            value: record.oldDescriptionA
          },
          {
            field: "Amount",
            renderValue: () => <Amount unit={record.oldProductA.amount.unit} quantity={record.oldProductA.amount.quantity}/>
          },
          {
            field: "Label(s)",
            value: record.oldProductA.labels.join(", ")
          },
          undefined,
          {
            field: "Input B",
            value: "",
            header: true
          },
          {
            field: "Description",
            value: record.oldDescriptionB
          },
          {
            field: "Input Amount",
            renderValue: () => <Amount unit={record.oldProductB.amount.unit} quantity={record.oldProductB.amount.quantity}/>
          },
          {
            field: "Label(s)",
            value: record.oldProductB.labels.join(", ")
          },
          undefined,
          {
            field: "Merged",
            value: "",
            header: true
          },
          {
            field: "Description",
            value: record.newDescription
          },
          {
            field: "Amount",
            renderValue: () => <Amount unit={record.newProduct.amount.unit} quantity={record.newProduct.amount.quantity}/>
          },
          {
            field: "Labels",
            value: record.newProduct.labels.join(", ")
          }
        ]}
      />
    );
  }
}

