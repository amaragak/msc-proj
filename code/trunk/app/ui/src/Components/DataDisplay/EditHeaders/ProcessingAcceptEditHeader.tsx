import React from "react";
import { SimpleTable } from "../Tables/SimpleTable";
import { productTypeFromId } from "../../../Types/ProductType";
import { Product, ProcessingRequest } from "@daml.js/app-0.0.1/lib/Product";
import { Amount } from "../NumberFormatting/Amount";

interface ProcessingAcceptEditHeaderProps {
  product: Product;
  request: ProcessingRequest;
}

export class ProcessingAcceptEditHeader extends React.Component<ProcessingAcceptEditHeaderProps, {}> {
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
            field: "Processor",
            value: "" + product.requestObserver?.toString()
          },
          {
            field: "Location",
            value: "" + request.location.name + ", " + request.location.country
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
          },
          {
            field: "Output Type",
            value: productTypeFromId(request.outputType).name
          }
        ]}
      />
    );
  }
}

