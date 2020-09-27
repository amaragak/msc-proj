import React from "react";
import NumberFormat from 'react-number-format';
import { TextField } from "@material-ui/core";

export interface LargeNumberInputProps {
  label: string;
  onChange: (value: string) => void;
  suffix?: string;
  error?: boolean;
  value?: string;
  disabled?: boolean;
}

interface NumberFormatCustomProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  suffix?: string;
}

class NumberFormatCustom extends React.Component<NumberFormatCustomProps, {}> {
  render() {
    const { inputRef, onChange, suffix, name, ...other } = this.props;
    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={(values) => {
          onChange({
            target: {
              name: name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        isNumericString
        suffix={suffix}
      />
    );
  }
}

export class LargeNumberInput extends React.Component<LargeNumberInputProps, {}> {
  render() {
    const { suffix, onChange, error, label, disabled, value } = this.props;
    return (
      <TextField
        fullWidth
        error={error}
        label={label}
        onChange={(e) => onChange(e.target.value)}
        name="numberformat"
        id="formatted-numberformat-input"
        InputProps={{
          inputComponent: NumberFormatCustom as any,
          inputProps: { suffix }
        }}
        disabled={disabled}
        value={value}
      />
    );
  }
}
