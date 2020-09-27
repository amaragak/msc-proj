import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

export interface InputDialogProps {
  open : boolean
  title : string
  onCancel : () => void
  onOkay : () => Promise<void>
}

export class InputDialog extends React.Component<InputDialogProps, {}> {
  render() {
    return (
      <Dialog open={this.props.open} onClose={() => this.props.onCancel()} maxWidth="sm" fullWidth>
        <DialogTitle>
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
