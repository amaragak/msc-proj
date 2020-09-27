import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import ExitToApp from "@material-ui/icons/ExitToApp";
import { styles, StyleProps } from "./styles";
import { signoutSuccess } from "../../Redux/Actions/UserActions";
import { UserState } from "../../Redux/State/UserState";
import { RootState } from "../../Redux/State/RootState";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { Dispatch } from "redux";
import { clearLocalStorage } from "../../Utils/LocalStorage";

interface StateProps {
  user: UserState;
}

interface DispatchProps {
  signoutSuccess: typeof signoutSuccess;
}

type HeaderComponentProps = StateProps & DispatchProps & StyleProps & RouteComponentProps & {
  history: History;
}

class HeaderComponent extends React.Component<HeaderComponentProps, {}> {
  private signout = () => {
    clearLocalStorage();
    this.props.signoutSuccess();
    this.props.history.push("/login");
  }

  render() {
    const { user, classes } = this.props;

    return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6" className={classes.logotype}>
        Tracking and Trading
        </Typography>
        <div className={classes.grow} />
        { user.loggedIn && <Typography variant="h6">{user.username}</Typography>}
        <IconButton
          aria-haspopup="true"
          color="inherit"
          className={classes.headerMenuButton}
          aria-controls="profile-menu"
          onClick={(event) => this.signout()}
        >
          <ExitToApp className={classes.headerIcon} />
        </IconButton>
      </Toolbar>
    </AppBar>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.user
});


const mapDispatchToProps = (dispatch: Dispatch) => ({
  signoutSuccess: () => dispatch(signoutSuccess())
});

const HeaderWithRouter = withRouter(HeaderComponent);
const HeaderWithStyles = withStyles(styles, { withTheme: true })(HeaderWithRouter);
export const Header = connect(mapStateToProps, mapDispatchToProps)(HeaderWithStyles);
