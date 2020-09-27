import React from "react";
import { ProductAuditRecord } from "./ProductAuditRecord";
import { ProductionRecord } from "../../../Types/ProductionRecord";
import { productTypeFromId } from "../../../Types/ProductType";
import { plotFromPlotId } from "../../../Types/Plot";
import { uiDate } from "../../../Utils/DateFormat";

interface ProductionRecordResultProps {
  record: ProductionRecord;
}

export class ProductionRecordResult extends React.Component<ProductionRecordResultProps, {}> {
  render() {
    const { record } = this.props;
    const plot = plotFromPlotId(record.plotId);
    return (
      <ProductAuditRecord
        title="Harvest"
        rows={[
          {
            field: "Producer",
            value: record.actor
          },
          {
            field: "Product",
            value: productTypeFromId(record.product.typeId).name
          },
          {
            field: "Label",
            value: record.product.labels[0]
          },
          {
            field: "Amount",
            value: record.product.amount.quantity + " " + record.product.amount.unit
          },
          {
            field: "Farmer",
            value: "" + plot?.farmer
          },
          {
            field: "Plot Number",
            value: "" + plot?.plotNumber
          },
          {
            field: "Location",
            value: record.location.name + ", " + record.location.country
          },
          {
            field: "Time",
            value: uiDate(record.time)
          }
        ]}
      />
    );
  }
}

