import React from "react";
import { SimpleTable } from "../Tables/SimpleTable";
import { productTypeFromId } from "../../../Types/ProductType";
import { uiDate } from "../../../Utils/DateFormat";
import { Product, ActiveProcessingOrder } from "@daml.js/app-0.0.1/lib/Product";
import { Amount } from "../NumberFormatting/Amount";

interface FinishProcessingEditHeaderProps {
  product: Product;
  order: ActiveProcessingOrder;
}

export class ProcessingFinishEditHeader extends React.Component<FinishProcessingEditHeaderProps, {}> {
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
            field: "Processor",
            value: product.handler
          },
          {
            field: "Start time",
            value: uiDate(order.startTime)
          },
          {
            field: "Location",
            value: "" + order.location.name + ", " + order.location.country
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
            value: productTypeFromId(order.outputType).name
          }
        ]}
      />
    );
  }
}

