import React from "react";
import { SimpleTable } from "../DataDisplay/Tables/SimpleTable";
import { TransportationStartRecord } from "../../Types/TransportationRecord";
import { productTypeFromId } from "../../Types/ProductType";
import { uiDate } from "../../Utils/DateFormat";
import { Amount } from "../DataDisplay/NumberFormatting/Amount";

interface TransportationStartResultProps {
  record: TransportationStartRecord;
}

export class TransportationStartResult extends React.Component<TransportationStartResultProps, {}> {
  render() {
    const { record } = this.props;
    return (
      <SimpleTable
        title="Transportation Start"
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
            field: "Label(s)" + (record.productForTransport.labels.length > 1 ? "s" : ""),
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
            field: "Start Location",
            value: record.startLocation.name + ", " + record.startLocation.country
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

