import React from "react";
import { SimpleTable } from "../DataDisplay/Tables/SimpleTable";
import { HandoverRecord } from "../../Types/HandoverRecord";
import { uiDate } from "../../Utils/DateFormat";
import { productTypeFromId } from "../../Types/ProductType";

interface HandoverRecordResultProps {
  record: HandoverRecord;
}

export class HandoverRecordResult extends React.Component<HandoverRecordResultProps, {}> {
  render() {
    const { record } = this.props;
    return (
      <SimpleTable
        title="Handover"
        rows={[
          {
            field: "Product",
            value: "",
            header: true
          },
          {
            field: "Type",
            value: productTypeFromId(record.product.typeId).name
          },
          {
            field: "Label(s)",
            value: record.product.labels.join(", ")
          },
          {
            field: "Amount",
            value: record.product.amount.quantity + " " + record.product.amount.unit
          },
          undefined,
          {
            field: "Details",
            value: "",
            header: true
          },
          {
            field: "Old Handler",
            value: record.oldHandler
          },
          {
            field: "New Handler",
            value: record.newHandler
          },
          {
            field: "Time",
            value: uiDate(record.time)
          }
        ]}
      />
    );
  }
}

