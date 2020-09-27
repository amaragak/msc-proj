import { createStyles, WithStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";
import brown from '@material-ui/core/colors/brown';
import green from '@material-ui/core/colors/green';
import purple from '@material-ui/core/colors/purple';
import orange from '@material-ui/core/colors/orange';

export const processColor = purple[500];
export const transportColor = brown[500];
export const productionColor = green[500];
export const mergeColor = orange[500];

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
  mergeConnector: {
    backgroundColor: mergeColor
  },
  productionConnector: {
    backgroundColor: productionColor
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
  },
  actions: {
    align: "center",
    textAlign: "center",
    margin: "0 auto",
    paddingTop: "10px"
  },
  requestButton: {
    width: "250px"
  }
});

export type StyleProps = WithStyles<typeof styles>;
