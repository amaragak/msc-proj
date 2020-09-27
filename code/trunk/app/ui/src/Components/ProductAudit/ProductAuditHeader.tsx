import React from "react";
import { SimpleTable } from "../DataDisplay/Tables/SimpleTable";
import { productTypeFromId } from "../../Types/ProductType";
import { productStateToString } from "../../Types/Product";
import { uiDate } from "../../Utils/DateFormat"
import { Product} from "@daml.js/app-0.0.1/lib/Product";
import Paper from '@material-ui/core/Paper';
import { styles, StyleProps } from "./styles";
import { withStyles } from "@material-ui/core/styles";
import { UserState } from "../../Redux/State/UserState";
import { HandoverEdit } from "../Editors/HandoverEdit";
import { HandoverRequestEdit } from "../Editors/HandoverRequestEdit";
import { HandoverAcceptEdit } from "../Editors/HandoverAcceptEdit";
import { SaleRequestEdit } from "../Editors/SaleRequestEdit";
import { SaleAcceptEdit } from "../Editors/SaleAcceptEdit";
import { ProductionRecordEdit } from "../Editors/ProductionRecordEdit";
import { ProcessingStartRecordEdit } from "../Editors/ProcessingStartRecordEdit";
import { ProcessingRequestEdit } from "../Editors/ProcessingRequestEdit";
import { ProcessingAcceptEdit } from "../Editors/ProcessingAcceptEdit";
import { ProcessingStartEdit } from "../Editors/ProcessingStartEdit";
import { ProcessingFinishEdit } from "../Editors/ProcessingFinishEdit";
import { TransportationStartRecordEdit } from "../Editors/TransportationStartRecordEdit";
import { TransportationRequestEdit } from "../Editors/TransportationRequestEdit";
import { TransportationWithdrawRequestEdit } from "../Editors/TransportationWithdrawRequestEdit";
import { TransportationAcceptEdit } from "../Editors/TransportationAcceptEdit";
import { TransportationStartEdit } from "../Editors/TransportationStartEdit";
import { TransportationFinishEdit } from "../Editors/TransportationFinishEdit";
import { ProcessingWithdrawRequestEdit } from "../Editors/ProcessingWithdrawRequestEdit";
import { HandoverWithdrawRequestEdit } from "../Editors/HandoverWithdrawRequestEdit";
import { SaleWithdrawRequestEdit } from "../Editors/SaleWithdrawRequestEdit";
import { ProductActions } from "./ProductActions";
import { ProductMergeEdit } from "../Editors/ProductMergeEdit";
import { ProductSplitEdit } from "../Editors/ProductSplitEdit";

interface ProductAuditHeaderComponentOwnProps {
  product: Product;
  user: UserState;
  allProducts: Product[];
}

export enum EditorType {
  NONE,
  SALE_REQUEST,
  SALE_WITHDRAW_REQUEST,
  SALE_ACCEPT,
  HANDOVER,
  HANDOVER_REQUEST,
  HANDOVER_REQUEST_OWNER,
  HANDOVER_WITHDRAW_REQUEST,
  HANDOVER_ACCEPT,
  PRODUCTION,
  PROCESSING_REQUEST,
  PROCESSING_WITHDRAW_REQUEST,
  PROCESSING_ACCEPT,
  PROCESSING_START,
  PROCESSING_COMPLETE,
  TRANSPORTATION_REQUEST,
  TRANSPORTATION_WITHDRAW_REQUEST,
  TRANSPORTATION_ACCEPT,
  TRANSPORTATION_START,
  TRANSPORTATION_COMPLETE,
  PROCESSING,
  MERGE,
  SPLIT,
  TRANSPORTATION,
  SELL_ORDER
}

interface ProductAuditHeaderComponentState {
  editorType: EditorType;
}

type ProductAuditHeaderComponentProps = ProductAuditHeaderComponentOwnProps & StyleProps;

class ProductAuditHeaderComponent extends React.Component<ProductAuditHeaderComponentProps, ProductAuditHeaderComponentState> {
  constructor(props: ProductAuditHeaderComponentProps) {
    super(props);
    this.state = { editorType: EditorType.NONE };
  }

  private mounted: boolean = false;

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  private closeEditor = () => {
    this.mounted && this.setState({ editorType: EditorType.NONE });
  }

  private setEditorType = (editorType: EditorType) => {
    this.mounted && this.setState({ ...this.state, editorType });
  }

  
  renderEditor() {
    const { product, user, allProducts } = this.props;
    switch(this.state.editorType) {
      case EditorType.HANDOVER: 
        return(
          <HandoverEdit
            open={this.state.editorType === EditorType.HANDOVER}
            onClose={this.closeEditor}
            user={user}
            product={product}
          />
        );
      case EditorType.HANDOVER_REQUEST: 
        return(
          <HandoverRequestEdit
            open={this.state.editorType === EditorType.HANDOVER_REQUEST}
            onClose={this.closeEditor}
            user={user}
            product={product}
          />
        );
      case EditorType.HANDOVER_REQUEST_OWNER: 
        return(
          <HandoverRequestEdit
            open={this.state.editorType === EditorType.HANDOVER_REQUEST_OWNER}
            onClose={this.closeEditor}
            user={user}
            product={product}
            onlyToOwner={true}
          />
        );
      case EditorType.HANDOVER_WITHDRAW_REQUEST: 
        return(
          <HandoverWithdrawRequestEdit
            open={this.state.editorType === EditorType.HANDOVER_WITHDRAW_REQUEST}
            onClose={this.closeEditor}
            user={user}
            product={product}
          />
        );
      case EditorType.HANDOVER_ACCEPT: 
        return(
          <HandoverAcceptEdit
            open={this.state.editorType === EditorType.HANDOVER_ACCEPT}
            onClose={this.closeEditor}
            user={user}
            product={product}
          />
        );
      case EditorType.SALE_REQUEST: 
        return(
          <SaleRequestEdit
            open={this.state.editorType === EditorType.SALE_REQUEST}
            onClose={this.closeEditor}
            user={user}
            product={product}
          />
        );
      case EditorType.SALE_WITHDRAW_REQUEST: 
        return(
          <SaleWithdrawRequestEdit
            open={this.state.editorType === EditorType.SALE_WITHDRAW_REQUEST}
            onClose={this.closeEditor}
            user={user}
            product={product}
          />
        );
      case EditorType.SALE_ACCEPT: 
        return(
          <SaleAcceptEdit
            open={this.state.editorType === EditorType.SALE_ACCEPT}
            onClose={this.closeEditor}
            user={user}
            product={product}
          />
        );
      case EditorType.PRODUCTION:
        return (
          <ProductionRecordEdit
            open={this.state.editorType === EditorType.PRODUCTION}
            onClose={this.closeEditor}
            user={user}
            product={product}
          />
        );
      case EditorType.PROCESSING:
        return (
          <ProcessingStartRecordEdit
            open={this.state.editorType === EditorType.PROCESSING}
            onClose={this.closeEditor}
            user={user}
            product={product}
          />
        );
      case EditorType.TRANSPORTATION:
        return (
          <TransportationStartRecordEdit
            open={this.state.editorType === EditorType.TRANSPORTATION}
            onClose={this.closeEditor}
            user={user}
            product={product}
          />
        );
      case EditorType.TRANSPORTATION_REQUEST:
        return (
          <TransportationRequestEdit
            open={this.state.editorType === EditorType.TRANSPORTATION_REQUEST}
            onClose={this.closeEditor}
            user={user}
            product={product}
          />
        );
      case EditorType.TRANSPORTATION_WITHDRAW_REQUEST:
        return (
          <TransportationWithdrawRequestEdit
            open={this.state.editorType === EditorType.TRANSPORTATION_WITHDRAW_REQUEST}
            onClose={this.closeEditor}
            user={user}
            product={product}
          />
        );
      case EditorType.TRANSPORTATION_ACCEPT:
        return (
          <TransportationAcceptEdit
            open={this.state.editorType === EditorType.TRANSPORTATION_ACCEPT}
            onClose={this.closeEditor}
            user={user}
            product={product}
          />
        );
      case EditorType.TRANSPORTATION_START:
        return (
          <TransportationStartEdit
            open={this.state.editorType === EditorType.TRANSPORTATION_START}
            onClose={this.closeEditor}
            user={user}
            product={product}
          />
        );
      case EditorType.TRANSPORTATION_COMPLETE:
        return (
          <TransportationFinishEdit
            open={this.state.editorType === EditorType.TRANSPORTATION_COMPLETE}
            onClose={this.closeEditor}
            user={user}
            product={product}
          />
        );
      case EditorType.PROCESSING_WITHDRAW_REQUEST:
        return (
          <ProcessingWithdrawRequestEdit
            open={this.state.editorType === EditorType.PROCESSING_WITHDRAW_REQUEST}
            onClose={this.closeEditor}
            user={user}
            product={product}
          />
        );
      case EditorType.PROCESSING_REQUEST:
        return (
          <ProcessingRequestEdit
            open={this.state.editorType === EditorType.PROCESSING_REQUEST}
            onClose={this.closeEditor}
            user={user}
            product={product}
          />
        );
      case EditorType.PROCESSING_ACCEPT:
        return (
          <ProcessingAcceptEdit
            open={this.state.editorType === EditorType.PROCESSING_ACCEPT}
            onClose={this.closeEditor}
            user={user}
            product={product}
          />
        );
      case EditorType.PROCESSING_START:
        return (
          <ProcessingStartEdit
            open={this.state.editorType === EditorType.PROCESSING_START}
            onClose={this.closeEditor}
            user={user}
            product={product}
          />
        );
      case EditorType.PROCESSING_COMPLETE:
        return (
          <ProcessingFinishEdit
            open={this.state.editorType === EditorType.PROCESSING_COMPLETE}
            onClose={this.closeEditor}
            user={user}
            product={product}
          />
        );
      case EditorType.MERGE:
        return (
          <ProductMergeEdit
            open={this.state.editorType === EditorType.MERGE}
            onClose={this.closeEditor}
            user={user}
            product={product}
            allProducts={allProducts}
          />
        );
      case EditorType.SPLIT:
        return (
          <ProductSplitEdit
            open={this.state.editorType === EditorType.SPLIT}
            onClose={this.closeEditor}
            user={user}
            product={product}
          />
        );
      default: return null;
    }
  }

  render() {
    const { product, classes, user, allProducts } = this.props;
    
    return (
      <React.Fragment>
        {this.renderEditor()}
        <div className={classes.sticky}>
          <Paper elevation={3} className={classes.paper}>
            <SimpleTable
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
                  value: productTypeFromId(product.productInfo.typeId).name
                },
                {
                  field: "Amount",
                  value: product.productInfo.amount.quantity + " " + product.productInfo.amount.unit
                },
                {
                  field: "State",
                  value: productStateToString(product, true)
                },
                {
                  field: "Last Updated",
                  value: product.recordKeys.length ? uiDate(product.lastUpdated) : "-"
                }
              ]}
            />
            <ProductActions allProducts={allProducts} product={product} user={user} setEditorType={this.setEditorType}/>
          </Paper>
        </div>
      </React.Fragment>
    );
  }
}

export const ProductAuditHeader = withStyles(styles, { withTheme: true })(ProductAuditHeaderComponent);

