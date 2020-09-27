import { Theme } from "@material-ui/core";
import { createStyles, WithStyles  } from "@material-ui/styles";

export const styles = (theme: Theme) => createStyles({
  title: {
    textAlign: "center"
  }
});

export type StyleProps = WithStyles<typeof styles>;
