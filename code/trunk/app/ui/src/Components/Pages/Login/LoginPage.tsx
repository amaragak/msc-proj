import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { AutocompleteInput } from "../../Input/AutocompleteInput";
import Fade from "@material-ui/core/Fade";
import { isLocalDev } from "../../../config";
import { styles, StyleProps } from "./styles";
import { Users, UserInfo } from "../../../Types/UserInfo";
import { dablLoginUrl, createToken } from "../../../config";
import { History } from 'history';
import { loginSuccess, loginFailure } from "../../../Redux/Actions/UserActions";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { withStyles } from "@material-ui/styles";
import { setLocalStorage } from "../../../Utils/LocalStorage";

interface DispatchProps {
  loginSuccess: typeof loginSuccess;
  loginFailure: typeof loginFailure;
}

type LoginPageComponentProps = DispatchProps & StyleProps & RouteComponentProps;

interface LoginPageComponentState {
  loginValue: UserInfo | undefined;
  error: boolean;
  isLoading: boolean;
}

class LoginPageComponent extends React.Component<LoginPageComponentProps, LoginPageComponentState> {
  constructor(props: LoginPageComponentProps) {
    super(props);
    this.state = { loginValue: undefined, error: false, isLoading: false };
  }

  private loginDablUser = () => {
    window.location.assign(`https://${dablLoginUrl}`);
  }

  private loginUser = (user: UserInfo, history: History) => {
    if (!!user) {
      const token = createToken(user.username);
      setLocalStorage(user.username, token);
      this.props.loginSuccess(user, token);
      this.setState({ ...this.state, error: false, isLoading: false });
      history.push("/app");
    } else {
      this.props.loginFailure();
      this.setState({ ...this.state, error: true, isLoading: false });
    }
  }

  render() {
    const { classes, history } = this.props;

    return (
      <Grid container className={classes.container}>
        <div className={classes.formContainer}>
          <div className={classes.form}>
              <React.Fragment>
                <Fade in={this.state.error}>
                  <Typography 
                    color="secondary" 
                    className={classes.errorMessage}
                  >
                    Something is wrong with your login or password :(
                  </Typography>
                </Fade>
                {!isLocalDev &&
                  <>
                    <Button 
                      className={classes.dablLoginButton}
                      variant="contained" 
                      color="primary" 
                      size="large" 
                      onClick={this.loginDablUser}
                    >
                      Log in with DABL
                    </Button>
                    <Typography>
                      OR
                    </Typography>
                  </>}
                <AutocompleteInput<UserInfo>
                  onChange={loginValue => this.setState({ ...this.state, loginValue })}
                  label="Username"
                  options={Users}
                  getOptionLabel={user => user.username}
                  error={false}
                />
                <div className={classes.formButtons}>
                  {this.state.isLoading ?
                    <CircularProgress size={26} className={classes.loginLoader} />
                  : <Button
                      disabled={this.state.loginValue === undefined}
                      onClick={() => this.state.loginValue && this.loginUser(this.state.loginValue, history) }
                      variant="contained"
                      color="primary"
                      size="large"
                    >
                      Login
                    </Button>}
                </div>
              </React.Fragment>
          </div>
        </div>
      </Grid>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loginSuccess: (user: UserInfo, token: string) => dispatch(loginSuccess(user, token)),
  loginFailure: () => dispatch(loginFailure())
});

const LoginPageWithRouter = withRouter(LoginPageComponent);
const LoginPageWithStyles = withStyles(styles, { withTheme: true })(LoginPageWithRouter);
export const LoginPage = connect(null, mapDispatchToProps)(LoginPageWithStyles);
