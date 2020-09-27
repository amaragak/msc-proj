import { Theme } from "@material-ui/core";
import { createStyles, WithStyles  } from "@material-ui/styles";

export const styles = (theme: Theme) => createStyles({
  root: {
    display: "flex",
    maxWidth: "100vw"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    width: `calc(100vw - ${240 + theme.spacing(6)}px)`,
    minHeight: "90vh",
    //overflowX: "scroll" as "scroll"
  },
  fakeToolbar: {
    ...theme.mixins.toolbar,
  }
});

export type StyleProps = WithStyles<typeof styles>;
