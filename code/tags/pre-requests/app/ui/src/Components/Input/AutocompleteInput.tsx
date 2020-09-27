import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";

export interface AutocompleteInputProps<T> {
  index?: number;
  label: string;
  options: T[];
  onChange: (value: T) => void;
  getOptionLabel: (option: T) => string;
  disabled?: boolean;
  error?: boolean;
  value?: T;
}

export class AutocompleteInput<T> extends React.Component<AutocompleteInputProps<T>, {}> {
  render() {
    const { index, options, label, value, getOptionLabel, onChange, error, disabled } = this.props;
    return (
      <FormControl key={index} fullWidth>
        <Autocomplete<T>
          options={options}
          getOptionLabel = {getOptionLabel}
          onChange={(e, value) => onChange(value as T)}
          renderInput={(params) => <TextField {...params} label={label} required error={error} />}
          disabled={disabled}
          value={value}
        />
      </FormControl>
    );
  }
}
