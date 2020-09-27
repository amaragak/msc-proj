import React from "react";
import { SimpleTable } from "../Tables/SimpleTable";
import { productTypeFromId } from "../../../Types/ProductType";
import { Product, SaleRequest } from "@daml.js/app-0.0.1/lib/Product";
import { Price } from "../NumberFormatting/Price";
import { Amount } from "../NumberFormatting/Amount";

interface SaleAcceptEditHeaderProps {
  product: Product;
  request: SaleRequest;
}

export class SaleAcceptEditHeader extends React.Component<SaleAcceptEditHeaderProps, {}> {
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
            value: request.currentHandler
          },
          {
            field: "Price",
            renderValue: () => <Price currency={request.currency} price={request.price}/>
          }
        ]}
      />
    );
  }
}

