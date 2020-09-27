import React from "react";
import { ProductAuditRecord } from "./ProductAuditRecord";
import { ProductionRecord } from "../../../Types/ProductionRecord";
import { productTypeFromId } from "../../../Types/ProductType";

interface ProductionRecordEditHeaderProps {
  record: ProductionRecord;
}

export class ProductionRecordEditHeader extends React.Component<ProductionRecordEditHeaderProps, {}> {
  render() {
    const { record } = this.props;
    return (
      <ProductAuditRecord
        rows={[
          {
            field: "Producer",
            value: record.actor
          },
          {
            field: "Product Type",
            value: productTypeFromId(record.product.typeId).name
          }
        ]}
      />
    );
  }
}

