import { createStyles, WithStyles } from "@material-ui/styles";

export const styles = (theme : any) => createStyles({
  drawer: {
    width: 270,
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  toolbar: {
    ...theme.mixins.toolbar,
  },
  linkRoot: {},
  link: {
    textDecoration: "none",
    "&:hover, &:focus": {
      backgroundColor: theme.palette.background.light,
    },
  },
  linkActive: {
    backgroundColor: theme.palette.background.light,
  },
  linkIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary + "99",
    width: 24,
    display: "flex",
    justifyContent: "center",
  },
  linkIconActive: {
    marginRight: theme.spacing(1),
    width: 24,
    display: "flex",
    justifyContent: "center",
    color: theme.palette.primary.main,
  },
  linkText: {
    padding: 0,
    fontSize: 16,
    color: theme.palette.text.secondary + "CC",
  },
  linkTextActive: {
    padding: 0,
    fontSize: 16,
    color: theme.palette.text.primary,
  },
});

export type StyleProps = WithStyles<typeof styles>;
