import React from "react";
import TextField from "@material-ui/core/TextField";

export interface DateInputProps {
  index?: number;
  onChange: (value: string) => void;
  label: string;
  error: boolean;
}

export class DateInput extends React.Component<DateInputProps, {}> {
  render() {
    return (
      <TextField
        required
        fullWidth
        type="date"
        key={this.props.index}
        label={this.props.label}
        onChange={e => this.props.onChange(e.target.value) }
        placeholder="YYYY-MM-DD"
        InputLabelProps={{
          shrink:true
        }}
        error={this.props.error}
      />
    );
  }
}
