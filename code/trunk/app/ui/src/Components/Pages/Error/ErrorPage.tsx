import React from "react";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { styles, StyleProps } from "./styles";
import { withStyles } from "@material-ui/styles";

class ErrorPageComponent extends React.Component<StyleProps, {}> {
  render() {
    const { classes } = this.props;

    return (
      <Grid container className={classes.container}>
        <Paper classes={{ root: classes.paperRoot }}>
          <Typography variant="h3" color="primary" className={classes.errorCode}>404</Typography>
          <Typography variant="h5" color="primary" className={classes.safetyText}>
            Oops. Looks like the page you&apos;re looking for no longer exists
          </Typography>
          <Button variant="contained" color="primary" component={Link} to="/" size="large" className={classes.backButton}>
            Back to Home
          </Button>
        </Paper>
      </Grid>
    );
  }
}

export const ErrorPage = withStyles(styles, { withTheme: true })(ErrorPageComponent);