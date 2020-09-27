import React from "react";
import { styles, StyleProps } from "./styles";
import { withStyles } from "@material-ui/core/styles";

interface ProductAuditRecordRowComponentOwnProps {
  field: string;
  value: string;
  key: number;
}

type ProductAuditRecordRowComponentProps = ProductAuditRecordRowComponentOwnProps & StyleProps;

class ProductAuditRecordRowComponent extends React.Component<ProductAuditRecordRowComponentProps, {}> {
  render() {
    const { classes, field, value, key } = this.props;
    return (
      <tr key={key} className={classes.row}>
        <td className={classes.recordLeft}>{field}</td>
        <td className={classes.recordRight}>{value}</td>
      </tr>
    )
  }
}

export const ProductAuditRecordRow = withStyles(styles, { withTheme: true })(ProductAuditRecordRowComponent);
