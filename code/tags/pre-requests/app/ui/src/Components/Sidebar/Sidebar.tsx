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
import Assignment from "@material-ui/icons/Assignment";
import LocalShipping from "@material-ui/icons/LocalShipping";
import Autorenew from "@material-ui/icons/Autorenew";
import Eco from "@material-ui/icons/Eco";
import LocalOffer from "@material-ui/icons/LocalOffer";
import People from "@material-ui/icons/People";

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
            icon={(<Assignment />)}
          />
          <SidebarLink
            label="Production Records" 
            path="/app/prod_recs" 
            location={location}
            classes={classes}
            icon={(<Eco />)}
          />
          <SidebarLink 
            label="Processing Records" 
            path="/app/proc_recs" 
            location={location}
            classes={classes}
            icon={(<Autorenew />)}
          />
          <SidebarLink 
            label="Transportation Records" 
            path="/app/tran_recs" 
            location={location}
            classes={classes}
            icon={(<LocalShipping />)}
          />
          <SidebarLink 
            label="Handover Records" 
            path="/app/hand_recs" 
            location={location}
            classes={classes}
            icon={(<People />)}
          />
          <SidebarLink 
            label="Sell Orders" 
            path="/app/sell" 
            location={location}
            classes={classes}
            icon={(<LocalOffer />)}
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
