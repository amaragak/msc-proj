import React from "react";
import { SimpleTable } from "../DataDisplay/Tables/SimpleTable";
import { TransportationEndRecord } from "../../Types/TransportationRecord";
import { productTypeFromId } from "../../Types/ProductType";
import { uiDate } from "../../Utils/DateFormat";
import { Amount } from "../DataDisplay/NumberFormatting/Amount";

interface TransportationEndResultProps {
  record: TransportationEndRecord;
}

export class TransportationEndResult extends React.Component<TransportationEndResultProps, {}> {
  render() {
    const { record } = this.props;
    return (
      <SimpleTable
        title="Transportation End"
        rows={[
          {
            field: "Product",
            value: "",
            header: true
          },
          {
            field: "Type",
            value: productTypeFromId(record.productForTransport.typeId).name
          },
          {
            field: "Label" + (record.productForTransport.labels.length > 1 ? "s" : ""),
            value: record.productForTransport.labels.join(", ")
          },
          {
            field: "Amount",
            renderValue: () => <Amount quantity={record.productForTransport.amount.quantity} unit={record.productForTransport.amount.unit} />
          },
          undefined,
          {
            field: "Details",
            value: "",
            header: true
          },
          {
            field: "Transporter",
            value: record.actor
          },
          {
            field: "End Location",
            value: record.endLocation.name + ", " + record.endLocation.country
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

