import React from "react";
import NumberFormat from 'react-number-format';

interface PriceProps {
  currency: string;
  price: string;
} 

export class Price extends React.Component<PriceProps, {}> {
  render() {
    return (
      <NumberFormat 
        value={this.props.price} 
        displayType={'text'} 
        thousandSeparator={true} 
        prefix={this.props.currency + " "} 
        renderText={value => <div>{value}</div>} 
        fixedDecimalScale={true}
        decimalScale={2}
      />
    );
  }
}
