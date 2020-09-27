import React from "react";
import NumberFormat from 'react-number-format';
import { TextField } from "@material-ui/core";

export interface TimeInputProps {
  label: string;
  onChange: (value: string) => void;
}

export class TimeInput extends React.Component<TimeInputProps, {}> {
  render() {
    return (
      <NumberFormat
        customInput={TextField as any}
        thousandSeparator
        isNumericString
        label={this.props.label}
        onChange={(e) => this.props.onChange(e.target.value as string)}
        fullWidth
        format="##:##"
      />
    );
  }
}
