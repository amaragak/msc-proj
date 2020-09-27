import React from "react";
import { SimpleTable } from "../Tables/SimpleTable";
import { uiDate } from "../../../Utils/DateFormat";
import { Product, ActiveTransportationOrder } from "@daml.js/app-0.0.1/lib/Product";
import { productTypeFromId } from "../../../Types/ProductType";
import { Amount } from "../NumberFormatting/Amount";

interface FinishTransportationEditHeaderProps {
  product: Product;
  order: ActiveTransportationOrder;
}

export class TransportationFinishEditHeader extends React.Component<FinishTransportationEditHeaderProps, {}> {
  render() {
    const { product, order } = this.props;
    return (
      <SimpleTable
        rows={[
          {
            field: "Product Owner",
            value: product.owner
          },
          {
            field: "Transpprter",
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
            field: "Start time",
            value: uiDate(order.startTime)
          },
          {
            field: "Start Location",
            value: "" + order.startLocation.name + ", " + order.startLocation.country
          },
          {
            field: "End Location",
            value: "" + order.endLocation.name + ", " + order.endLocation.country
          }
        ]}
      />
    );
  }
}

