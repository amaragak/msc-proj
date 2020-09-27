import React from "react";
import { SimpleTable } from "../Tables/SimpleTable";
import { Product } from "@daml.js/app-0.0.1/lib/Product";

interface ProductEditHeaderProps {
  product: Product;
}

export class ProductEditHeader extends React.Component<ProductEditHeaderProps, {}> {
  render() {
    const { product } = this.props;
    return (
      <SimpleTable
        rows={[
          {
            field: "Owner",
            value: product.owner
          },
          {
            field: "Handler",
            value: product.handler
          }
        ]}
      />
    );
  }
}

