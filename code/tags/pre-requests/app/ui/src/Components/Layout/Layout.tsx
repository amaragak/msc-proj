import React from "react";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import DamlLedger from "@daml/react";
import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";
import { ProductsPage } from "../Pages/Main/ProductsPage";
import { ProductionRecordsPage } from "../Pages/Main/ProductionRecordsPage";
import { ProcessingRecordsPage } from "../Pages/Main/ProcessingRecordsPage";
import { TransportationRecordsPage } from "../Pages/Main/TransportationRecordsPage";
import { HandoverRecordsPage } from "../Pages/Main/HandoverRecordsPage";
import { wsBaseUrl, httpBaseUrl } from "../../config";
import { styles, StyleProps } from "./styles";
import { RootState } from "../../Redux/State/RootState";
import { UserState } from "../../Redux/State/UserState";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";

interface StateProps {
  user: UserState;
}

type LayoutComponentProps = StateProps & RouteComponentProps & StyleProps;

class LayoutComponent extends React.Component<LayoutComponentProps, {}> {
  render() {
    const { user, classes } = this.props;

    if(!user.loggedIn){
      return null;
    } else {
      return (
        <DamlLedger party={user.username} token={user.token} httpBaseUrl={httpBaseUrl} wsBaseUrl={wsBaseUrl}>
          <div className={classes.root}>
            <>
              <Header />
              <Sidebar />
              <div className={classes.content}>
                <div className={classes.fakeToolbar} />
                <Switch>
                  <Route path="/app/prods" component={ProductsPage} />
                </Switch>
                <Switch>
                  <Route path="/app/prod_recs" component={ProductionRecordsPage} />
                </Switch>
                <Switch>
                  <Route path="/app/proc_recs" component={ProcessingRecordsPage} />
                </Switch>
                <Switch>
                  <Route path="/app/tran_recs" component={TransportationRecordsPage} />
                </Switch>
                <Switch>
                  <Route path="/app/hand_recs" component={HandoverRecordsPage} />
                </Switch>
              </div>
            </>
          </div>
        </DamlLedger>
      );
    }
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.user
});

const mapDispatchToProps = () => ({});

const LayoutWithRouter = withRouter(LayoutComponent);
const LayoutWithStyles = withStyles(styles, { withTheme: true })(LayoutWithRouter);
export const Layout = connect(mapStateToProps, mapDispatchToProps)(LayoutWithStyles);
