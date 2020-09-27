import React from "react"
import { Product, ProductState } from "@daml.js/app-0.0.1/lib/Product";
import { RecordType } from "@daml.js/app-0.0.1/lib/Record";
import { UserState } from "../../Redux/State/UserState";
import LocalShipping from "@material-ui/icons/LocalShipping";
import Autorenew from "@material-ui/icons/Autorenew";
import Eco from "@material-ui/icons/Eco";
import People from "@material-ui/icons/People";
import AttachMoney from "@material-ui/icons/AttachMoney";
import CallMerge from "@material-ui/icons/CallMerge";
import CallSplit from "@material-ui/icons/CallSplit";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { styles, StyleProps } from "./styles";
import { withStyles } from "@material-ui/core/styles";
import { EditorType } from "./ProductAuditHeader";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { hasRole, UserRole } from "../../Types/UserInfo";

interface ProductActionsOwnProps {
  product: Product;
  allProducts: Product[];
  user: UserState;
  setEditorType: (editorType: EditorType) => void;
}

type ProductActionsProps = ProductActionsOwnProps & StyleProps;

interface ProductActionsState {
  clickedAction?: {
    element: HTMLElement;
    actionGroup: ActionGroup;
  }
}

enum ActionGroup {
  SELL,
  HANDOVER,
  PRODUCTION,
  PROCESSING,
  TRANSPORTATION,
  MERGE,
  SPLIT
}

interface AvailableMenuActions {
  sell: EditorType[];
  handover: EditorType[];
  production: EditorType[];
  processing: EditorType[];
  transportation: EditorType[];
  merge: EditorType[];
  split: EditorType[];
}

class ProductActionsComponent extends React.Component<ProductActionsProps, ProductActionsState> {
  constructor(props: ProductActionsProps) {
    super(props);
    this.state = { clickedAction: undefined };
  }

  private renderButton(editorType: EditorType, prompt: string) {
    const { classes } = this.props;

    return (
      <div className={classes.actions}>
        <Button
          color="primary"
          size="small" 
          variant="contained" 
          onClick={() => this.props.setEditorType(editorType)}
          className={classes.requestButton}
        >
          {prompt}
        </Button>
      </div>
    );
  }

  private renderRequestButtons() {
    const { user, product } = this.props;

    const isRequestObserver = user.loggedIn && user.username === product.requestObserver;
    const isOfferObserver = user.loggedIn && user.username === product.offerObserver;
    const isHandler = user.loggedIn && user.username === product.handler;
    const isOwner = user.loggedIn && user.username === product.owner;

    switch (product.state) {
      case ProductState.SALE_REQUESTED:
        if (isOfferObserver) return this.renderButton(EditorType.SALE_ACCEPT, "Review Offer");
        if (isOwner) return this.renderButton(EditorType.SALE_WITHDRAW_REQUEST, "Withdraw Offer");
        return null;
      case ProductState.HANDOVER_REQUESTED:
        if (isRequestObserver) return this.renderButton(EditorType.HANDOVER_ACCEPT, "Review Handover Request");
        if (isHandler) return this.renderButton(EditorType.HANDOVER_WITHDRAW_REQUEST, "Withdraw Handover Request");
        return null;
      case ProductState.PROCESSING_REQUESTED:
        if (isRequestObserver) return this.renderButton(EditorType.PROCESSING_ACCEPT, "Review Processing Request");
        if (isOwner) return this.renderButton(EditorType.PROCESSING_WITHDRAW_REQUEST, "Withdraw Processing Request");
        return null;
      case ProductState.PROCESSING_ACCEPTED:
        if (isHandler) return this.renderButton(EditorType.PROCESSING_START, "Start Processing");
        return null;
      case ProductState.IN_PROCESS:
        if (isHandler) return this.renderButton(EditorType.PROCESSING_COMPLETE, "Complete Processing");
        return null;
      case ProductState.TRANSPORTATION_REQUESTED:
        if (isRequestObserver) return this.renderButton(EditorType.TRANSPORTATION_ACCEPT, "Review Transportation Request");
        if (isOwner) return this.renderButton(EditorType.TRANSPORTATION_WITHDRAW_REQUEST, "Withdraw Transportation Request");
        return null;
      case ProductState.TRANSPORTATION_ACCEPTED:
        if (isHandler) return this.renderButton(EditorType.TRANSPORTATION_START, "Start Transportation");
        return null;
      case ProductState.IN_TRANSIT:
        if (isHandler) return this.renderButton(EditorType.TRANSPORTATION_COMPLETE, "Complete Transportation");
        return null;
      default: return null;
    }
  }

  private onClickAction = (event: React.MouseEvent<HTMLElement>, actionGroup: ActionGroup) => {
    this.setState({ clickedAction: { element: event.currentTarget, actionGroup } });
  }

  private onCloseMenu = () => {
    this.setState({ clickedAction: undefined });
  }

  private onClickMenuItem = (editorType: EditorType) => {
    this.props.setEditorType(editorType);
    this.onCloseMenu();
  }

  private getAvailableMenuActions(): AvailableMenuActions {
    const { user, product, allProducts } = this.props;
    let availableMenuActions: AvailableMenuActions = {
      sell: [],
      handover: [],
      production: [],
      processing: [],
      transportation: [],
      merge: [],
      split: []
    };

    if (!user.loggedIn) return availableMenuActions;  

    const idle = product.state === ProductState.IDLE;
    const isOwner = user.loggedIn && user.username === product.owner;
    const isHandler = user.loggedIn && user.username === product.handler;
    const notNew = (product.lastRecordType !== RecordType.UNDEFINED);
    const isProducer = hasRole(user, [UserRole.ADMIN, UserRole.PRODUCER]);
    const productionStage = ((product.lastRecordType === RecordType.PRODUCTION) || product.recordKeys.length === 0);
    const isProcessor = hasRole(user, [UserRole.ADMIN, UserRole.PROCESSOR]);
    const isTransporter = hasRole(user, [UserRole.ADMIN, UserRole.TRANSPORTER]);
    const positiveQuantity = (+product.productInfo.amount.quantity) > 0.0;

    const canRequestSale = idle && user.loggedIn && isOwner && notNew;
    const canRequestHandover = idle && isHandler && notNew;
    const canRequestHandoverToOwner = canRequestHandover && !isOwner;
    const canProduce = idle && user.loggedIn && isHandler && isProducer && productionStage;
    const canProcess = idle && user.loggedIn && isHandler && isOwner && isProcessor && notNew;
    const canSubmitProcessRequest = idle && isOwner && notNew;
    const canTransport = idle && user.loggedIn && isHandler && isOwner && isTransporter && notNew;
    const canSubmitTransportRequest = idle && isOwner && notNew;

    const canSplit = isOwner && isHandler && idle && positiveQuantity;
    const canMerge = isOwner && isHandler && allProducts.some(p => {
      const _isOwner = (p.owner === user.username)
      const _isHandler = (p.handler === user.username);
      const _differentId = p.productId !== product.productId;
      const _sameType = p.productInfo.typeId === product.productInfo.typeId;
      const _idle = p.state === ProductState.IDLE;
      const _positiveQuantity = (+p.productInfo.amount.quantity) > 0.0;
      return _isOwner && _isHandler && _differentId && _sameType && _idle && idle && _positiveQuantity && positiveQuantity;
    });

    if (canRequestSale) availableMenuActions.sell.push(EditorType.SALE_REQUEST);
    if (canRequestHandover) availableMenuActions.handover.push(EditorType.HANDOVER_REQUEST);
    if (canRequestHandoverToOwner) availableMenuActions.handover.push(EditorType.HANDOVER_REQUEST_OWNER);
    if (canProduce) availableMenuActions.production.push(EditorType.PRODUCTION);
    if (canProcess) availableMenuActions.processing.push(EditorType.PROCESSING);
    if (canSubmitProcessRequest) availableMenuActions.processing.push(EditorType.PROCESSING_REQUEST);
    if (canTransport) availableMenuActions.transportation.push(EditorType.TRANSPORTATION);
    if (canSubmitTransportRequest) availableMenuActions.transportation.push(EditorType.TRANSPORTATION_REQUEST);
    if (canMerge) availableMenuActions.merge.push(EditorType.MERGE);
    if (canSplit) availableMenuActions.split.push(EditorType.SPLIT);

    return availableMenuActions;
  }

  private renderMenuItem(available: EditorType[], editorType: EditorType, prompt: string) {
    if (!available.some(e => e === editorType)) return null;
    else return (
      <MenuItem key={editorType} onClick={() => this.onClickMenuItem(editorType)}>{prompt}</MenuItem>
    );
  }

  private renderMenuItems(availableMenuActions: AvailableMenuActions) {
    if (!this.state.clickedAction) return null;
    switch (this.state.clickedAction.actionGroup) {
      case ActionGroup.SELL:
        return this.renderMenuItem(availableMenuActions.sell, EditorType.SALE_REQUEST, "Offer Item");

      case ActionGroup.HANDOVER:
        return [
          this.renderMenuItem(availableMenuActions.handover, EditorType.HANDOVER_REQUEST, "Request Handover"),
          this.renderMenuItem(availableMenuActions.handover, EditorType.HANDOVER_REQUEST_OWNER, "Request Handover To Owner")
        ].filter(Boolean);

      case ActionGroup.PRODUCTION:
        return this.renderMenuItem(availableMenuActions.production, EditorType.PRODUCTION, "Add Production Record");

      case ActionGroup.PROCESSING:
        return [
          this.renderMenuItem(availableMenuActions.processing, EditorType.PROCESSING, "Start Processing"),
          this.renderMenuItem(availableMenuActions.processing, EditorType.PROCESSING_REQUEST, "Request Processing")
        ].filter(Boolean);

      case ActionGroup.TRANSPORTATION:
        return [
          this.renderMenuItem(availableMenuActions.transportation, EditorType.TRANSPORTATION, "Start Transportation"),
          this.renderMenuItem(availableMenuActions.transportation, EditorType.TRANSPORTATION_REQUEST, "Request Transportation")
        ].filter(Boolean);

      case ActionGroup.MERGE:
        return this.renderMenuItem(availableMenuActions.merge, EditorType.MERGE, "Merge Products");

      case ActionGroup.SPLIT:
        return this.renderMenuItem(availableMenuActions.split, EditorType.SPLIT, "Split Product");
    }
  }

  private renderMenu(availableMenuActions: AvailableMenuActions) {
    return (
      <Menu
        id="simple-menu"
        anchorEl={this.state.clickedAction?.element}
        keepMounted
        open={Boolean(this.state.clickedAction)}
        onClose={this.onCloseMenu}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {this.renderMenuItems(availableMenuActions)}
      </Menu>
    );
  }

  private renderActions() {
    const { classes } = this.props;
    const availableMenuActions = this.getAvailableMenuActions();
    return (
      <React.Fragment>
        <div className={classes.actions}>
          <ButtonGroup>
            <Button 
              color="primary" 
              variant="contained" 
              onClick={e => this.onClickAction(e, ActionGroup.SELL)}
              disabled={availableMenuActions.sell.length === 0}
            >
              <AttachMoney />
            </Button>
            <Button 
              color="primary" 
              variant="contained" 
              onClick={e => this.onClickAction(e, ActionGroup.HANDOVER)}
              disabled={availableMenuActions.handover.length === 0}
            >
              <People />
            </Button>
            <Button 
              color="primary" 
              variant="contained" 
              onClick={e => this.onClickAction(e, ActionGroup.PRODUCTION)}
              disabled={availableMenuActions.production.length === 0}
            >
              <Eco />
            </Button>
            <Button 
              color="primary" 
              variant="contained" 
              onClick={e => this.onClickAction(e, ActionGroup.PROCESSING)}
              disabled={availableMenuActions.processing.length === 0}
            >
              <Autorenew />
            </Button>
            <Button 
              color="primary" 
              variant="contained" 
              onClick={e => this.onClickAction(e, ActionGroup.TRANSPORTATION)}
              disabled={availableMenuActions.transportation.length === 0}
            >
              <LocalShipping />
            </Button>
            <Button 
              color="primary" 
              variant="contained" 
              onClick={e => this.onClickAction(e, ActionGroup.MERGE)}
              disabled={availableMenuActions.merge.length === 0}
            >
              <CallMerge />
            </Button>
            <Button 
              color="primary" 
              variant="contained" 
              onClick={e => this.onClickAction(e, ActionGroup.SPLIT)}
              disabled={availableMenuActions.split.length === 0}
            >
              <CallSplit />
            </Button>
          </ButtonGroup>
        </div>
        {this.renderMenu(availableMenuActions)}
      </React.Fragment>
    );
  }

  render() {
    if (this.props.product.state === ProductState.IDLE) return this.renderActions();
    else return this.renderRequestButtons();
  }
}

export const ProductActions = withStyles(styles, { withTheme: true })(ProductActionsComponent);
