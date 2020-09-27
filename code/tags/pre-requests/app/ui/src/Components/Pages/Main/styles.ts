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
  paper: {
    padding: '6px 16px',
  }
});

export type StyleProps = WithStyles<typeof styles>;
