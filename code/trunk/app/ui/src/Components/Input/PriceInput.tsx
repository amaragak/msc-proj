import React from "react";
import { SelectInput } from "./SelectInput";
import { LargeNumberInput } from "./LargeNumberInput";
import Grid from "@material-ui/core/Grid";

export interface PriceInputProps {
  index?: number;
  onChangePrice: (value: string) => void;
  onChangeCurrency: (value: string) => void;
  currencyOptions: string[];
  currency: string;
  priceLabel: string;
  currencyLabel: string;
  currencyDisabled?: boolean;
  priceError?: boolean;
  priceDisabled?: boolean;
  price?: string;
  currencyError?: boolean;
}

export class PriceInput extends React.Component<PriceInputProps, {}> {
  render() {
    return (
      <Grid container spacing={3} direction="row" justify="center" alignItems="center">
        <Grid item xs={9}>
          <LargeNumberInput
            label="Price"
            onChange={this.props.onChangePrice}
            prefix={this.props.currency + " "}
            error={this.props.priceError}
            disabled={this.props.priceDisabled}
            value={this.props.price}
            twoDecimalPoints={true}
          />
        </Grid>
        <Grid item xs>
          <SelectInput
            disabled={this.props.currencyDisabled}
            label="Currency"
            options={this.props.currencyOptions}
            onChange={this.props.onChangeCurrency}
            value={this.props.currency}
            fullWidth={true}
            error={this.props.currencyError}
          />
        </Grid>
      </Grid>
    );
  }
}
