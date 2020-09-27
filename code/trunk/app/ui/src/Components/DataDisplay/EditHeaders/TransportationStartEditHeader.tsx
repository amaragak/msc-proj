import React from "react";
import { SimpleTable } from "../Tables/SimpleTable";
import { uiDate } from "../../../Utils/DateFormat";
import { Product, NewTransportationOrder } from "@daml.js/app-0.0.1/lib/Product";
import { productTypeFromId } from "../../../Types/ProductType";
import { Amount } from "../NumberFormatting/Amount";

interface TransportationStartEditHeaderProps {
  product: Product;
  newOrder: NewTransportationOrder;
}

export class TransportationStartEditHeader extends React.Component<TransportationStartEditHeaderProps, {}> {
  render() {
    const { product, newOrder } = this.props;
    return (
      <SimpleTable
        rows={[
          {
            field: "Product Owner",
            value: product.owner
          },
          {
            field: "Transporter",
            value: product.handler
          },
          {
            field: "Product",
            value: productTypeFromId(product.productInfo.typeId).name
          },
          {
            field: "Labels",
            value: product.productInfo.labels.join(", ")
          },
          {
            field: "Amount",
            renderValue: () => <Amount quantity={product.productInfo.amount.quantity} unit={product.productInfo.amount.unit}/>
          },
          {
            field: "Handed over",
            value: uiDate(newOrder.handoverTime)
          },
          {
            field: "Start Location",
            value: "" + newOrder.startLocation.name + ", " + newOrder.startLocation.country
          },
          {
            field: "End Location",
            value: "" + newOrder.endLocation.name + ", " + newOrder.endLocation.country
          }
        ]}
      />
    );
  }
}

