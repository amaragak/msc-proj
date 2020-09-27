import React from "react";
import { styles, StyleProps } from "./styles";
import { withStyles } from "@material-ui/core/styles";
import { ProductTimeline } from "./ProductTimeline";
import { ProductAuditHeader } from "./ProductAuditHeader";
import { Product } from "@daml.js/app-0.0.1/lib/Product";
import { UserState } from "../../../Redux/State/UserState";
import { HandoverEdit } from "../../Editors/HandoverEdit";
import { ProductionRecordEdit } from "../../Editors/ProductionRecordEdit";
import { ProcessingRecordEdit } from "../../Editors/ProcessingRecordEdit";
import { TransportationRecordEdit } from "../../Editors/TransportationRecordEdit";

interface ProductAuditComponentOwnProps {
  product: Product;
  user: UserState;
}

type ProductAuditComponentProps = ProductAuditComponentOwnProps & StyleProps;

enum OpenEditor {
  NONE,
  HANDOVER,
  PRODUCTION,
  PROCESSING,
  TRANSPORTATION,
  SELL_ORDER
}

interface ProductAuditComponentState {
  openEditor: OpenEditor;
}

class ProductAuditComponent extends React.Component<ProductAuditComponentProps, ProductAuditComponentState> {
  constructor(props: ProductAuditComponentProps) {
    super(props);
    this.state = { openEditor: OpenEditor.NONE };
  }

  closeEditor = () => {
    this.setState({ openEditor: OpenEditor.NONE });
  }
  
  render() {
    const { classes, product, user } = this.props;
    return (
      <>
        <HandoverEdit
          open={this.state.openEditor === OpenEditor.HANDOVER}
          onClose={this.closeEditor}
          user={user}
          product={product}
        />
        <ProductionRecordEdit
          open={this.state.openEditor === OpenEditor.PRODUCTION}
          onClose={this.closeEditor}
          user={user}
          product={product}
        />
        <ProcessingRecordEdit
          open={this.state.openEditor === OpenEditor.PROCESSING}
          onClose={this.closeEditor}
          user={user}
          product={product}
        />
        <TransportationRecordEdit
          open={this.state.openEditor === OpenEditor.TRANSPORTATION}
          onClose={this.closeEditor}
          user={user}
          product={product}
        />
        <table className={classes.audit}>
          <tbody>
            <tr>
              <td className={classes.header}>
                <ProductAuditHeader 
                  product={product} 
                  user={user}
                  onClickCreateSellOrder={() => this.setState({ openEditor: OpenEditor.SELL_ORDER })}
                  onClickHandover={() => this.setState({ openEditor: OpenEditor.HANDOVER })}
                  onClickProduce={() => this.setState({ openEditor: OpenEditor.PRODUCTION })}
                  onClickProcess={() => this.setState({ openEditor: OpenEditor.PROCESSING })}
                  onClickTransport={() => this.setState({ openEditor: OpenEditor.TRANSPORTATION })}
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
