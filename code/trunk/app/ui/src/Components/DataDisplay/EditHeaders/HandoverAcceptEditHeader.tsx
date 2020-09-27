import React from "react";
import { SimpleTable } from "../Tables/SimpleTable";
import { productTypeFromId } from "../../../Types/ProductType";
import { Product, HandoverRequest } from "@daml.js/app-0.0.1/lib/Product";
import { Amount } from "../NumberFormatting/Amount";

interface HandoverAcceptEditHeaderProps {
  product: Product;
  request: HandoverRequest;
}

export class HandoverAcceptEditHeader extends React.Component<HandoverAcceptEditHeaderProps, {}> {
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
            field: "Current Handler",
            value: request.oldHandler
          },
          {
            field: "New Handler",
            value: request.newHandler
          }
        ]}
      />
    );
  }
}

