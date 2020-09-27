import React from "react";
import { SelectInput } from "./SelectInput";
import { LargeNumberInput } from "./LargeNumberInput";
import Grid from "@material-ui/core/Grid";

export interface AmountInputProps {
  index?: number;
  onChangeQuantity: (value: string) => void;
  onChangeUnit: (value: string) => void;
  unitOptions: string[];
  unit: string;
  quantityLabel: string;
  unitLabel: string;
  unitDisabled?: boolean;
  quantityError?: boolean;
  quantityDisabled?: boolean;
  quantity?: string;
  unitError?: boolean;
}

export class AmountInput extends React.Component<AmountInputProps, {}> {
  render() {
    return (
      <Grid container spacing={3} direction="row" justify="center" alignItems="center">
        <Grid item xs={9}>
          <LargeNumberInput
            label="Quantity"
            onChange={this.props.onChangeQuantity}
            suffix={" " + this.props.unit}
            error={this.props.quantityError}
            disabled={this.props.quantityDisabled}
            value={this.props.quantity}
          />
        </Grid>
        <Grid item xs>
          <SelectInput
            disabled={this.props.unitDisabled}
            label="Unit"
            options={this.props.unitOptions}
            onChange={this.props.onChangeUnit}
            value={this.props.unit}
            fullWidth={true}
            error={this.props.unitError}
          />
        </Grid>
      </Grid>
    );
  }
}

/*

          <TextField
            required
            type="number"
            key={this.props.index}
            label="Quantity"
            onChange={e => this.props.onChangeQuantity(e.target.value) }
            fullWidth
          />
*/