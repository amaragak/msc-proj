import React from "react";
import { SimpleTable } from "../Tables/SimpleTable";
import { productTypeFromId } from "../../../Types/ProductType";
import { Product } from "@daml.js/app-0.0.1/lib/Product";
import { Amount } from "../NumberFormatting/Amount";

interface ProcessingStartRecordEditHeaderProps {
  product: Product;
}

export class ProcessingStartRecordEditHeader extends React.Component<ProcessingStartRecordEditHeaderProps, {}> {
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
            field: "Processor",
            value: product.handler
          },
          {
            field: "Input Product",
            value: productTypeFromId(product.productInfo.typeId).name
          },
          {
            field: "Input Labels",
            value: product.productInfo.labels.join(", ")
          },
          {
            field: "Input Amount",
            renderValue: () => <Amount quantity={product.productInfo.amount.quantity} unit={product.productInfo.amount.unit}/>
          }
        ]}
      />
    );
  }
}

