import { createStyles, WithStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";

export const styles = (theme : Theme) => createStyles({
  divider: {
    marginTop: "25px",
    marginBottom: "25px"
  },
  choiceButton: {
    //paddingTop: 0,
    //paddingBottom: 0,
  },
  empty: {
    textAlign: "center"
  },
  prompt: {
    textAlign: "center"
  },
  paper: {
    padding: '6px 16px',
  },
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
  }
});

export type StyleProps = WithStyles<typeof styles>;
