import React from "react";
import { styles, StyleProps } from "./styles";
import { withStyles } from "@material-ui/core/styles";
import { ProductAuditRecordRow } from "./ProductAuditRecordRow";
import Typography from '@material-ui/core/Typography';

interface ProductAuditRecordComponentOwnProps {
  rows: {
    field: string,
    value: string
  }[],
  title?: string;
}

type ProductAuditRecordComponentProps = ProductAuditRecordComponentOwnProps & StyleProps;

class ProductAuditRecordComponent extends React.Component<ProductAuditRecordComponentProps, {}> {
  render() {
    const { classes, rows, title } = this.props;
    return (
      <React.Fragment>
        {!!title &&<Typography variant="h6" component="h1" align="center">
          {title}
        </Typography>}
        <table className={classes.table}>
          <tbody>
            {rows.map((row, i) => <ProductAuditRecordRow key={i} field={row.field} value={row.value}/>)}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export const ProductAuditRecord = withStyles(styles, { withTheme: true })(ProductAuditRecordComponent);
