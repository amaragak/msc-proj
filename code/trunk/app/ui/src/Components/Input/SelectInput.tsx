import React from "react";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";

export interface SelectInputProps {
  index?: number;
  label: string;
  options: string[];
  onChange: (value: string) => void;
  value: string;
  fullWidth?: boolean;
  disabled?: boolean;
  error?: boolean;
};

export class SelectInput extends React.Component<SelectInputProps, {}> {
  render() {
    return (
      <FormControl 
        key={this.props.index} 
        fullWidth={(this.props.fullWidth === undefined) ? true : this.props.fullWidth}>
        <InputLabel required>{this.props.label}</InputLabel>
        <Select
          error={this.props.error}
          disabled={this.props.disabled}
          value={this.props.value}
          defaultValue={""}
          onChange={e => this.props.onChange(e.target.value as string)}>
          {this.props.options.map(item => (<MenuItem key={item} value={item}>{item}</MenuItem>))}
        </Select>
      </FormControl>
    );
  }
}
