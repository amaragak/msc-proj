import React from "react";
import TextField from "@material-ui/core/TextField";

export interface TextInputProps {
  label: string;
  index?: number;
  onChange: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
  value?: string;
  placeholder?: string;
  errorMessage?: string;
}

export class TextInput extends React.Component<TextInputProps, {}> {
  render() {
    return (
      <TextField
        required
        fullWidth
        key={this.props.index}
        label={this.props.label}
        onChange={e => this.props.onChange(e.target.value) }
        error={this.props.error}
        disabled={this.props.disabled}
        value={this.props.value}
        placeholder={this.props.placeholder}
        helperText={this.props.errorMessage}
      />
    );
  }
}
