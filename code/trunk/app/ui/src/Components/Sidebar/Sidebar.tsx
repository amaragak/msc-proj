import React from "react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { History, Location } from "history";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/styles";
import { styles, StyleProps } from "./styles";
import LocalShipping from "@material-ui/icons/LocalShipping";
import Autorenew from "@material-ui/icons/Autorenew";
import Eco from "@material-ui/icons/Eco";
import LocalOffer from "@material-ui/icons/LocalOffer";
import People from "@material-ui/icons/People";
import AttachMoney from "@material-ui/icons/AttachMoney";
import CallSplit from "@material-ui/icons/CallSplit";
import CallMerge from "@material-ui/icons/CallMerge";

type SidebarComponentProps = StyleProps & RouteComponentProps;

class SidebarComponent extends React.Component<SidebarComponentProps, {}> {
  render() {
    const { classes, location } = this.props;

    return (
      <Drawer open variant="permanent" className={classes.drawer} classes={{ paper: classes.drawer }}>
        <div className={classes.toolbar} />
        <List style={{ width: "100%" }}>
        <SidebarLink
            label="Products" 
            path="/app/prods" 
            location={location}
            classes={classes}
            icon={(<LocalOffer />)}
          />
          <SidebarLink 
            label="Sales" 
            path="/app/sale_recs" 
            location={location}
            classes={classes}
            icon={(<AttachMoney />)}
          />
          <SidebarLink 
            label="Handovers" 
            path="/app/hand_recs" 
            location={location}
            classes={classes}
            icon={(<People />)}
          />
          <SidebarLink
            label="Production" 
            path="/app/prod_recs" 
            location={location}
            classes={classes}
            icon={(<Eco />)}
          />
          <SidebarLink 
            label="Processing" 
            path="/app/proc_recs" 
            location={location}
            classes={classes}
            icon={(<Autorenew />)}
          />
          <SidebarLink 
            label="Transportation" 
            path="/app/tran_recs" 
            location={location}
            classes={classes}
            icon={(<LocalShipping />)}
          />
          <SidebarLink 
            label="Merges" 
            path="/app/merge_recs" 
            location={location}
            classes={classes}
            icon={(<CallMerge />)}
          />
          <SidebarLink 
            label="Splits" 
            path="/app/split_recs" 
            location={location}
            classes={classes}
            icon={(<CallSplit />)}
          />
        </List>
      </Drawer>
    );
  }
}

const SidebarWithStyles = withStyles(styles, { withTheme: true })(SidebarComponent);
export const Sidebar = withRouter(SidebarWithStyles);

interface SidebarLinkOwnProps {
  path: string;
  icon?: JSX.Element;
  label: string;
  location: Location<History.PoorMansUnknown>;
}

type SidebarLinkProps = SidebarLinkOwnProps & StyleProps;

class SidebarLink extends React.Component<SidebarLinkProps, {}> {
  render() {
    const { classes, location, path, icon, label } = this.props;
    const active = path && (location.pathname === path || location.pathname.indexOf(path) !== -1);

    return (
      <ListItem
        divider={true}
        button component={Link}
        to={path} 
        className={classes.link} 
        classes={{ root: active ? classes.linkActive : classes.linkRoot }} disableRipple
      >
        {icon && <ListItemIcon className={active ? classes.linkIconActive : classes.linkIcon}>{icon}</ListItemIcon>}
        <ListItemText classes={{ primary: active ? classes.linkTextActive : classes.linkText }} primary={label} />
      </ListItem>
    );
  }
}
