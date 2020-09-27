import { createStyles, WithStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";

export const styles = (theme : Theme) => createStyles({
  container: {
    marginTop: "14px"
  },
  tableCell: {
    verticalAlign: "top",
    paddingTop: 6,
    paddingBottom: 6,
    fontSize: "0.93rem"
  },
  tableHeaderCell: {
    verticalAlign: "top",
    paddingTop: 6,
    paddingBottom: 6,
    fontSize: "0.93rem",
    fontWeight: "bold"
  },
  tableCellButton: {
    verticalAlign: "center",
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: "0.75rem"
  },
  tableRow: {
    height: "auto"
  },
  selectableRow: {
    height: "auto",
    cursor: "pointer"
  },
  textField: {
    fontSize: "0.75rem"
  },
  textFieldUnderline: {
    "&:before": {
      borderBottomColor: theme.palette.primary.light,
    },
    "&:after": {
      borderBottomColor: theme.palette.primary.main,
    },
    "&:hover:before": {
      borderBottomColor: `${theme.palette.primary.light} !important`,
    },
  },
  recordLeft: {
    textAlign: "right",
    verticalAlign: "baseline",
    width: "50%",
    fontWeight: "bold",
    //paddingBottom: "0.5em",
    paddingRight: "0.25em",
    fontSize: "0.90rem",
    overflowWrap: "break-word"
  },
  simpleHeader: {
    textAlign: "right",
    verticalAlign: "baseline",
    width: "50%",
    fontWeight: "bold",
    //paddingBottom: "0.5em",
    paddingRight: "0.25em",
    fontSize: "1rem",
    overflowWrap: "break-word"
  },
  recordRight: {
    textAlign: "left",
    width: "50%",
    //paddingBottom: "0.5em",
    paddingLeft: "0.25em",
    fontSize: "0.90rem",
    overflowWrap: "break-word"
  },
  spacer: {
    height: "10px"
  },
  simpleRow: {
    fontSize: "medium"
  },
  simpleTable: {
    width: "100%"
  },
});

export type StyleProps = WithStyles<typeof styles>;
