import React from "react";
import { SimpleTable } from "../Tables/SimpleTable";
import { productTypeFromId } from "../../../Types/ProductType";
import { Product } from "@daml.js/app-0.0.1/lib/Product";
import { Amount } from "../NumberFormatting/Amount";

interface SaleRequestEditHeaderProps {
  product: Product;
}

export class SaleRequestEditHeader extends React.Component<SaleRequestEditHeaderProps, {}> {
  render() {
    const { product } = this.props;
    return (
      <SimpleTable
        rows={[
          {
            field: "Product Owner",
            value: product.owner
          },
          {
            field: "Current Handler",
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
          }
        ]}
      />
    );
  }
}

