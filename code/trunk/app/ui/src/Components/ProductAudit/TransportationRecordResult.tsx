import React from "react";
import { SimpleTable } from "../DataDisplay/Tables/SimpleTable";
import { TransportationRecord } from "../../Types/TransportationRecord";
import { productTypeFromId } from "../../Types/ProductType";
import { uiDate } from "../../Utils/DateFormat";

interface TransportationRecordResultProps {
  record: TransportationRecord;
}

export class TransportationRecordResult extends React.Component<TransportationRecordResultProps, {}> {
  render() {
    const { record } = this.props;
    return (
      <SimpleTable
        title="Transport"
        rows={[
          {
            field: "Transporter",
            value: record.actor
          },
          {
            field: "Product",
            value: productTypeFromId(record.product.typeId).name
          },
          {
            field: "Label" + (record.product.labels.length > 1 ? "s" : ""),
            value: record.product.labels.join(", ")
          },
          {
            field: "Amount",
            value: record.product.amount.quantity + " " + record.product.amount.unit
          },
          {
            field: "Start Location",
            value: record.startLocation.name + ", " + record.startLocation.country
          },
          {
            field: "Start Time",
            value: uiDate(record.startTime)
          },
          {
            field: "End Location",
            value: record.endLocation.name + ", " + record.endLocation.country
          },
          {
            field: "End Time",
            value: uiDate(record.endTime)
          },
        ]}
      />
    );
  }
}

