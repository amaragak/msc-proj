import React from "react";
import { GenericTable, GenericTableRow } from "./GenericTable";
import { Product } from "@daml.js/app-0.0.1/lib/Product";
import { ProductTemplate } from "../../../Types/Product";
import { styles, StyleProps } from "./styles";
import { withStyles } from "@material-ui/core/styles";
import { UserState } from "../../../Redux/State/UserState";

export interface ProductTableComponentOwnProps {
  user: UserState;
  columnNames: string[];
  recordToRow: (record: Product) => GenericTableRow;
  onRecordSelected?: (record: Product | undefined) => void;
}

type ProductTableComponentProps = ProductTableComponentOwnProps & StyleProps;

class ProductTableComponent extends React.Component<ProductTableComponentProps, {}> {
  render() {
    const { user, columnNames, recordToRow, onRecordSelected, classes } = this.props;
    return(
      <GenericTable<Product, ProductTemplate>
        useStream={true} 
        user={user}
        columnNames={columnNames}
        recordToRow={recordToRow}
        selectable={true}
        onRecordSelected={onRecordSelected}
        classes={classes}
        template={Product}
        comparator={(a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastRecordType).getTime()}
        getId={a => a.productId}
        getVersion={a => a.version}
      />
    );
  }
}

export const ProductTable = withStyles(styles, { withTheme: true })(ProductTableComponent);
