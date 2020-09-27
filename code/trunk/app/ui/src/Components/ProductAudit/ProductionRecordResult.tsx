import React from "react";
import { SimpleTable } from "../DataDisplay/Tables/SimpleTable";
import { ProductionRecord } from "../../Types/ProductionRecord";
import { productTypeFromId } from "../../Types/ProductType";
import { plotFromPlotId } from "../../Types/Plot";
import { uiDate } from "../../Utils/DateFormat";
import { Amount } from "../DataDisplay/NumberFormatting/Amount";

interface ProductionRecordResultProps {
  record: ProductionRecord;
}

export class ProductionRecordResult extends React.Component<ProductionRecordResultProps, {}> {
  render() {
    const { record } = this.props;
    const plot = plotFromPlotId(record.plotId);
    return (
      <SimpleTable
        title="Harvest"
        rows={[
          {
            field: "Product",
            value: "",
            header: true
          },
          {
            field: "Type",
            value: productTypeFromId(record.product.typeId).name
          },
          {
            field: "Label",
            value: record.product.labels[0]
          },
          {
            field: "Amount",
            renderValue: () => <Amount quantity={record.product.amount.quantity} unit={record.product.amount.unit}/>
          },
          undefined,
          {
            field: "Details",
            value: "",
            header: true
          },
          {
            field: "Producer",
            value: record.actor
          },
          {
            field: "Farmer",
            value: !!plot ? plot.farmer : record.plotId
          },
          {
            field: "Plot Number",
            value: !!plot ? String(plot.plotNumber) : record.plotId
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

