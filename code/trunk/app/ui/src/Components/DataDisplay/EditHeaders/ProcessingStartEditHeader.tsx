import React from "react";
import { SimpleTable } from "../Tables/SimpleTable";
import { productTypeFromId } from "../../../Types/ProductType";
import { uiDate } from "../../../Utils/DateFormat";
import { Product, NewProcessingOrder } from "@daml.js/app-0.0.1/lib/Product";
import { Amount } from "../NumberFormatting/Amount";

interface StartProcessingEditHeaderProps {
  product: Product;
  newOrder: NewProcessingOrder;
}

export class ProcessingStartEditHeader extends React.Component<StartProcessingEditHeaderProps, {}> {
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
            field: "Processor",
            value: product.handler
          },
          {
            field: "Handed over",
            value: uiDate(newOrder.handoverTime)
          },
          {
            field: "Location",
            value: "" + newOrder.location.name + ", " + newOrder.location.country
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
            value: productTypeFromId(newOrder.outputType).name
          }
        ]}
      />
    );
  }
}

