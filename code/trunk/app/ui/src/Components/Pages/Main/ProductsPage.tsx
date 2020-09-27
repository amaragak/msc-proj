import React from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Product } from "@daml.js/app-0.0.1/lib/Product";
import { styles, StyleProps } from "./styles";
import { withStyles } from "@material-ui/core/styles";
import { ProductEdit } from "../../Editors/ProductEdit";
import { productTypeFromId } from "../../../Types/ProductType";
import { productStateToString } from "../../../Types/Product";
import { ProductTable } from "../../DataDisplay/Tables/ProductTable";
import { UserRole, hasRole } from "../../../Types/UserInfo";
import { RootState } from "../../../Redux/State/RootState";
import { UserState } from "../../../Redux/State/UserState";
import { connect } from "react-redux";
import Divider from "@material-ui/core/Divider";
import { ProductAudit } from "../../ProductAudit/ProductAudit";
import { uiDate } from "../../../Utils/DateFormat";

interface StateProps {
  user: UserState;
}

type ProductsPageComponentProps = StateProps & StyleProps;

interface ProductsPageComponentState {
  editorOpen: boolean;
  selectedProduct: Product | undefined;
  products: Product[];
}

export class ProductsPageComponent extends React.Component<ProductsPageComponentProps, ProductsPageComponentState> {
  constructor(props: ProductsPageComponentProps) {
    super(props);
    this.state = { editorOpen: false, selectedProduct: undefined, products: [] };
  }

  render() {
    const { user, classes } = this.props;
    const { selectedProduct, products } = this.state;
    if (!user.loggedIn) return null;
    const canCreate = hasRole(user, [UserRole.ADMIN, UserRole.PRODUCER]);

    return (
      <>
        <Typography variant="h5" component="h5" align="left">
          Products
        </Typography>
        <Typography variant="body2" align="left">
          View, create, and take action on products stored on the ledger.
        </Typography>
        <Divider className={classes.divider}/>
        <ProductEdit 
          open={this.state.editorOpen} 
          onClose={() => this.setState({ ...this.state, editorOpen: false })}
          user={user}
          allProducts={products}
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
          onReceiveRecords={products => this.setState({ ...this.state, products })}
          columnNames={[
            "Owner",
            "Handler",
            "Type",
            "Description",
            "Amount",
            "State",
            "Last Updated",
          ]}
          recordToRow={ record => ({ entries: [
            record.owner,
            record.handler,
            productTypeFromId(record.productInfo.typeId)?.name,
            record.description,
            record.productInfo.amount.quantity + " " + record.productInfo.amount.unit,
            productStateToString(record, false),
            record.recordKeys.length ? uiDate(record.lastUpdated) : "-"
          ]})}
        />
        <Divider className={classes.divider}/>
        {!!selectedProduct 
          ? <ProductAudit user={user} product={selectedProduct} allProducts={products}/> 
          : <div className={classes.prompt}>Select a product from the table</div>
        }
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.user
});

const ProductsPageWithStyles = withStyles(styles, { withTheme: true })(ProductsPageComponent);
export const ProductsPage = connect(mapStateToProps, null)(ProductsPageWithStyles);
