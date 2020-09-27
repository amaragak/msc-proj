import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { styles, StyleProps } from "./styles";
import { withStyles } from "@material-ui/core/styles";

export interface InputDialogOwnProps {
  open : boolean
  title : string
  onCancel : () => void
  onOkay : () => void
  onEnter : () => void
}

type InputDialogProps = InputDialogOwnProps & StyleProps;

class InputDialogComponent extends React.Component<InputDialogProps, {}> {
  render() {
    return (
      <Dialog
        open={this.props.open} 
        onClose={() => this.props.onCancel()} 
        onEnter={this.props.onEnter} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle className={this.props.classes.title}>
          {this.props.title}
        </DialogTitle>
        <DialogContent>
          {this.props.children}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.onCancel()} color="primary">
            Cancel
          </Button>
          <Button onClick={() => this.props.onOkay()} color="primary">
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export const InputDialog = withStyles(styles, { withTheme: true })(InputDialogComponent);
