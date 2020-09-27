import React from "react";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import { Layout } from "./Layout/Layout";
import { ErrorPage  } from "./Pages/Error/ErrorPage";
import { LoginPage } from "./Pages/Login/LoginPage";
import { loginSuccess } from "../Redux/Actions/UserActions";
import { RootState } from "../Redux/State/RootState";
import { UserState } from "../Redux/State/UserState";
import { getUserInfo, UserInfo } from "../Types/UserInfo";
import { connect } from "react-redux"
import { Dispatch } from "redux";
import { setLocalStorage } from "../Utils/LocalStorage";

interface StateProps {
  user: UserState;
}

interface DispatchProps {
  loginSuccess: typeof loginSuccess;
}

class AppComponent extends React.Component<StateProps & DispatchProps, {}> {
  render() {
    return (
      <BrowserRouter >
        <Switch>
          <Route 
            exact 
            path="/" 
            render={() => <RootRoute loginSuccess={this.props.loginSuccess}/>} 
          />
          <Route
            exact
            path="/app"
            render={() => <Redirect to="/app/prods" />}
          />
          <PrivateRoute 
            path="/app" 
            render={() => <Layout />}
            user={this.props.user}
          />
          <PublicRoute 
            path="/login" 
            render={() => <LoginPage />} 
            user={this.props.user}
          />
          <Route component={ErrorPage} />
        </Switch>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.user
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loginSuccess: (user: UserInfo, token: string) => dispatch(loginSuccess(user, token))
});

export const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

type RootRouteProps = DispatchProps;

class RootRoute extends React.Component<RootRouteProps, {}> {
  componentWillMount() {
    const url = new URL(window.location.toString());
    const token = url.searchParams.get('token');
    if (token === null) {
      return;
    }

    const party = url.searchParams.get('party');
    if (party === null) {
      throw Error("When 'token' is passed via URL, 'party' must be passed too.");
    }
    
    const user = getUserInfo(party);
    if (!user) {
      throw Error("URL derived user could not be found in DB");
    }
    
    setLocalStorage(party, token);
    this.props.loginSuccess(user, token);
  }

  render() {
    return (<Redirect to="/app/prod_recs" />);
  }
}

type RouteProps = StateProps & { 
  path: string;
  render: () => JSX.Element;
 };

class PrivateRoute extends React.Component<RouteProps, {}> {
  render() {
    return (
      <Route
        path={this.props.path}
        render={(props) =>
          this.props.user.loggedIn ? (
            this.props.render()
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      />
    );
  }
}

class PublicRoute extends React.Component<RouteProps, {}> {
  render() {
    return (
      <Route
        path={this.props.path}
        render={() =>
          this.props.user.loggedIn ? (
            <Redirect
              to={{
                pathname: "/",
              }}
            />
          ) : (
            this.props.render()
          )
        }
      />
    );
  }
}
