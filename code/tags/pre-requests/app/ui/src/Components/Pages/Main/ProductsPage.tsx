import React from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Product } from "@daml.js/app-0.0.1/lib/Product";
import { styles, StyleProps } from "./styles";
import { withStyles } from "@material-ui/core/styles";
import { ProductEdit } from "../../Editors/ProductEdit";
import { productTypeFromId } from "../../../Types/ProductType";
import { ProductTable } from "../../DataDisplay/Tables/ProductTable";
import { UserRole, hasRole } from "../../../Types/UserInfo";
import { RootState } from "../../../Redux/State/RootState";
import { UserState } from "../../../Redux/State/UserState";
import { connect } from "react-redux";
import Divider from "@material-ui/core/Divider";
import { ProductAudit } from "../../DataDisplay/ProductAudit/ProductAudit";
import { uiDate } from "../../../Utils/DateFormat";

interface StateProps {
  user: UserState;
}

type ProductsPageComponentProps = StateProps & StyleProps;

interface ProductsPageComponentState {
  editorOpen: boolean;
  selectedProduct: Product | undefined;
}

export class ProductsPageComponent extends React.Component<ProductsPageComponentProps, ProductsPageComponentState> {
  constructor(props: ProductsPageComponentProps) {
    super(props);
    this.state = { editorOpen: false, selectedProduct: undefined };
  }

  render() {
    const { user, classes } = this.props;
    const { selectedProduct } = this.state;
    if (!user.loggedIn) return null;
    const canCreate = hasRole(user, [UserRole.ADMIN, UserRole.PRODUCER]);

    return (
      <>
        <Typography variant="h5" component="h5" align="left">
          Products
        </Typography>
        <Typography variant="body2" component="body" align="left">
          View, create, and take action on products.
        </Typography>
        <Divider className={classes.divider}/>
        <ProductEdit 
          open={this.state.editorOpen} 
          onClose={() => this.setState({ ...this.state, editorOpen: false })}
          user={user}
        />
        <Button 
          disabled={!canCreate} 
          color="primary" 
          size="small" 
          className={classes.choiceButton} 
          variant="contained" 
          onClick={() => this.setState({ ...this.state, editorOpen: true })}
        >
          New Raw Product
        </Button>
        <ProductTable
          user={user}
          onRecordSelected={selectedProduct => this.setState({ ...this.state, selectedProduct })}
          columnNames={[
            "Owner",
            "Handler",
            "Type",
            "Description",
            "Amount",
            "Last Updated"
          ]}
          recordToRow={ record => ({ entries: [
            record.owner,
            record.handler,
            productTypeFromId(record.productType)?.name,
            record.description,
            record.amount.quantity + " " + record.amount.unit,
            record.recordKeys.length ? uiDate(record.lastUpdated) : "-"
          ]})}
        />
        <Divider className={classes.divider}/>
        {!!selectedProduct ? <ProductAudit user={user} product={selectedProduct}/> : "Select a product from the table"}
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.user
});

const ProductsPageWithStyles = withStyles(styles, { withTheme: true })(ProductsPageComponent);
export const ProductsPage = connect(mapStateToProps, null)(ProductsPageWithStyles);
