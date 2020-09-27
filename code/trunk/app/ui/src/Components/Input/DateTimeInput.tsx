import React from "react";
import TextField from "@material-ui/core/TextField";

export interface DateTimeInputProps {
  onChange: (value: string) => void;
  value: string;
  label: string;
  error: boolean;
  errorMessage?: string;
  disabled?: boolean;
}

export class DateTimeInput extends React.Component<DateTimeInputProps, {}> {
  render() {
    return (
      <TextField
        fullWidth
        id="datetime-local"
        value={this.props.value}
        label={this.props.label}
        type="datetime-local"
        onChange={e => this.props.onChange(e.target.value as string)}
        InputLabelProps={{
          shrink: true
        }}
        error={this.props.error}
        helperText={this.props.errorMessage}
        disabled={this.props.disabled}
      />
    );
  }
}


