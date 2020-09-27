import React from "react";
import { ProductAuditRecord } from "./ProductAuditRecord";
import { productTypeFromId } from "../../../Types/ProductType";
import { uiDate } from "../../../Utils/DateFormat"
import { Product } from "@daml.js/app-0.0.1/lib/Product";
import { RecordType } from "@daml.js/app-0.0.1/lib/Record";
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { styles, StyleProps } from "./styles";
import { withStyles } from "@material-ui/core/styles";
import { UserState } from "../../../Redux/State/UserState";
import { hasRole, UserRole } from "../../../Types/UserInfo";

interface ProductAuditHeaderComponentOwnProps {
  product: Product;
  user: UserState;
  onClickCreateSellOrder: () => void;
  onClickHandover: () => void;
  onClickProduce: () => void;
  onClickProcess: () => void;
  onClickTransport: () => void;
}

type ProductAuditHeaderComponentProps = ProductAuditHeaderComponentOwnProps & StyleProps;

class ProductAuditHeaderComponent extends React.Component<ProductAuditHeaderComponentProps, {}> {
  render() {
    const { product, classes, user } = this.props;
    const isOwner = user.loggedIn && user.username === product.owner;
    const isHandler = user.loggedIn && user.username === product.handler;
    const canHandover = isHandler && product.lastRecordType !== RecordType.UNDEFINED;
    const canSell = isOwner && product.lastRecordType !== RecordType.UNDEFINED;
    const canProduce = user.loggedIn && isHandler && hasRole(user, [UserRole.ADMIN, UserRole.PRODUCER]) && 
      ((product.lastRecordType === RecordType.PRODUCTION) || product.recordKeys.length === 0);
    const canProcess = user.loggedIn && isHandler && hasRole(user, [UserRole.ADMIN, UserRole.PROCESSOR]) &&
      (product.lastRecordType !== RecordType.UNDEFINED)
    const canTransport = user.loggedIn && isHandler && hasRole(user, [UserRole.ADMIN, UserRole.TRANSPORTER]) && 
      (product.lastRecordType !== RecordType.UNDEFINED)
    
    return (
      <div className={classes.sticky}>
        <Paper elevation={3} className={classes.paper}>
          <ProductAuditRecord
            title={product.description}
            rows={[
              {
                field: "Owner",
                value: product.owner
              },
              {
                field: "Current Handler",
                value: product.handler
              },
              {
                field: "Description",
                value: product.description
              },
              {
                field: "Product Type",
                value: productTypeFromId(product.productType).name
              },
              {
                field: "Amount",
                value: product.amount.quantity + " " + product.amount.unit
              },
              {
                field: "Last Updated",
                value: product.recordKeys.length ? uiDate(product.lastUpdated) : "-"
              }
            ]}
          />
          <table className={classes.actionTable}>
            <tbody>
              <tr>
                <td>
                  <Button 
                    disabled={!canSell} 
                    color="primary" 
                    size="small" 
                    variant="contained" 
                    onClick={this.props.onClickCreateSellOrder}
                    className={classes.auditAction}
                  >
                    Create Sell Order
                  </Button>
                </td>
              </tr>
              <tr>
                <td>
                  <Button 
                    disabled={!canHandover} 
                    color="primary" 
                    size="small" 
                    variant="contained" 
                    onClick={this.props.onClickHandover}
                    className={classes.auditAction}
                  >
                    Handover
                  </Button>
                </td>
              </tr>
              <tr>
                <td>
                  <Button 
                    disabled={!canProduce} 
                    color="primary" 
                    size="small" 
                    variant="contained" 
                    onClick={this.props.onClickProduce}
                    className={classes.auditAction}
                  >
                    ADD PRODUCTION RECORD
                  </Button>
                </td>
              </tr>
              <tr>
                <td>
                  <Button 
                    disabled={!canProcess} 
                    color="primary" 
                    size="small" 
                    variant="contained" 
                    onClick={this.props.onClickProcess}
                    className={classes.auditAction}
                  >
                    ADD PROCESSING RECORD
                  </Button>
                </td>
              </tr>
              <tr>
                <td>
                  <Button 
                    disabled={!canTransport} 
                    color="primary" 
                    size="small" 
                    variant="contained" 
                    onClick={this.props.onClickTransport}
                    className={classes.auditAction}
                  >
                    ADD TRANSPORTATION RECORD
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </Paper>
      </div>
      
    );
  }
}

export const ProductAuditHeader = withStyles(styles, { withTheme: true })(ProductAuditHeaderComponent);
