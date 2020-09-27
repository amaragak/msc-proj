import React from "react";
import { SimpleTable } from "../Tables/SimpleTable";
import { TransportationRecord } from "../../../Types/TransportationRecord";
import { productTypeFromId } from "../../../Types/ProductType";
import { Amount } from "../NumberFormatting/Amount";

interface TransportationRecordEditHeaderProps {
  record: TransportationRecord;
}

export class TransportationRecordEditHeader extends React.Component<TransportationRecordEditHeaderProps, {}> {
  render() {
    const { record } = this.props;
    return (
      <SimpleTable
        rows={[
          {
            field: "Transporter",
            value: record.actor
          },
          {
            field: "Product Type",
            value: productTypeFromId(record.product.typeId).name
          },
          {
            field: "Product Labels",
            value: record.product.labels.join(", ")
          },
          {
            field: "Amount",
            renderValue: () => <Amount quantity={record.product.amount.quantity} unit={record.product.amount.unit}/>
          }
        ]}
      />
    );
  }
}

