import React from "react";
import { styles, StyleProps } from "./styles";
import { withStyles } from "@material-ui/core/styles";
import { ProductTimeline } from "./ProductTimeline";
import { ProductAuditHeader } from "./ProductAuditHeader";
import { Product } from "@daml.js/app-0.0.1/lib/Product";
import { UserState } from "../../Redux/State/UserState";

interface ProductAuditComponentOwnProps {
  product: Product;
  user: UserState;
  allProducts: Product[];
}

type ProductAuditComponentProps = ProductAuditComponentOwnProps & StyleProps;

class ProductAuditComponent extends React.Component<ProductAuditComponentProps, {}> {
  render() {
    const { classes, product, user, allProducts } = this.props;
    return (
      <>
        <table className={classes.audit}>
          <tbody>
            <tr>
              <td className={classes.header}>
                <ProductAuditHeader 
                  product={product} 
                  user={user}
                  allProducts={allProducts}
                />
              </td>
              <td className={classes.timeline}>
                <ProductTimeline 
                  product={product} 
                  user={user}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </>
    );
  }
}

export const ProductAudit = withStyles(styles, { withTheme: true })(ProductAuditComponent);
