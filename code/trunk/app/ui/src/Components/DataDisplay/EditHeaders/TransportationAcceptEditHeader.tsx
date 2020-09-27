import React from "react";
import { SimpleTable } from "../Tables/SimpleTable";
import { Product, TransportationRequest } from "@daml.js/app-0.0.1/lib/Product";
import { Amount } from "../NumberFormatting/Amount";
import { productTypeFromId } from "../../../Types/ProductType";

interface TransportationAcceptEditHeaderProps {
  product: Product;
  request: TransportationRequest;
}

export class TransportationAcceptEditHeader extends React.Component<TransportationAcceptEditHeaderProps, {}> {
  render() {
    const { product, request } = this.props;
    return (
      <SimpleTable
        rows={[
          {
            field: "Product Owner",
            value: product.owner
          },
          {
            field: "Transporter",
            value: "" + product.requestObserver?.toString()
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
            field: "Start Location",
            value: "" + request.startLocation.name + ", " + request.startLocation.country
          },
          {
            field: "End Location",
            value: "" + request.endLocation.name + ", " + request.endLocation.country
          }
        ]}
      />
    );
  }
}

