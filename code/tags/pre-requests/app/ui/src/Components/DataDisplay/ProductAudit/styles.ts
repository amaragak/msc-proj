import { createStyles, WithStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";
import brown from '@material-ui/core/colors/brown';
import green from '@material-ui/core/colors/green';

export const processColor = "#f50057";
export const transportColor = brown[500];
export const productionColor = green[500];

export const styles = (theme : Theme) => createStyles({
  paper: {
    padding: '6px 16px'
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main
  },
  processConnector: {
    backgroundColor: processColor
  },
  transportConnector: {
    backgroundColor: transportColor
  },
  productionConnector: {
    backgroundColor: productionColor
  },
  recordLeft: {
    textAlign: "right",
    verticalAlign: "baseline",
    width: "50%",
    fontWeight: "bold",
    //paddingBottom: "0.5em",
    paddingRight: "0.25em",
    fontSize: "0.93rem"
  },
  recordRight: {
    textAlign: "left",
    width: "50%",
    //paddingBottom: "0.5em",
    paddingLeft: "0.25em",
    fontSize: "0.93rem"
  },
  row: {
    fontSize: "medium"
  },
  table: {
    width: "100%"
  },
  sticky: {
    position: "sticky",
    top: "70px",
    zIndex: 1
  },
  header: {
    verticalAlign: "top",
    width: "50%",
    padding: "6px 16px"
  },
  timeline: {
    verticalAlign: "top"
  },
  audit: {
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto"
  },
  auditAction: {
    width: "250px"
  },
  actionTable: {
    textAlign: "center",
    align: "center",
    margin: "0 auto"
  }
});

export type StyleProps = WithStyles<typeof styles>;
