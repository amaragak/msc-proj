import { createStyles, WithStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";

export const styles = (theme : Theme) => createStyles({
  logotype: {
    color: "white",
    marginLeft: theme.spacing(2.5),
    marginRight: theme.spacing(2.5),
    fontWeight: 700,
    fontSize: 21,
    whiteSpace: "nowrap",
  },
  appBar: {
    paddingLeft: "calc(100vw - 100%)",
    width: "100vw",
    zIndex: theme.zIndex.drawer + 1,
  },
  toolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  grow: {
    flexGrow: 1,
  },
  headerMenuButton: {
    marginLeft: theme.spacing(2),
    padding: theme.spacing(0.5),
  },
  headerIcon: {
    fontSize: 28
  }
});

export type StyleProps = WithStyles<typeof styles>;
