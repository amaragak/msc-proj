import React from "react";
import { SimpleTable } from "../DataDisplay/Tables/SimpleTable";
import { SplitRecord } from "../../Types/SplitRecord";
import { Amount } from "../DataDisplay/NumberFormatting/Amount";

interface SplitRecordResultProps {
  record: SplitRecord;
}

export class SplitRecordResult extends React.Component<SplitRecordResultProps, {}> {
  render() {
    const { record } = this.props;
    return (
      <SimpleTable
        title="Split"
        rows={[
          {
            field: "Original Product",
            value: "",
            header: true
          },
          {
            field: "Description",
            value: record.oldDescription
          },
          {
            field: "Amount",
            renderValue: () => <Amount unit={record.oldProduct.amount.unit} quantity={record.oldProduct.amount.quantity}/>
          },
          undefined,
          {
            field: "Split A",
            value: "",
            header: true
          },
          {
            field: "Description",
            value: record.newDescriptionA
          },
          {
            field: "Amount",
            renderValue: () => <Amount unit={record.newProductA.amount.unit} quantity={record.newProductA.amount.quantity}/>
          },
          undefined,
          {
            field: "Split B",
            value: "",
            header: true
          },
          {
            field: "Description",
            value: record.newDescriptionB
          },
          {
            field: "Amount",
            renderValue: () => <Amount unit={record.newProductB.amount.unit} quantity={record.newProductB.amount.quantity}/>
          },
        ]}
      />
    );
  }
}

