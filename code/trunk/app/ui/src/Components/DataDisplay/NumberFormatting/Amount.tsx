import React from "react";
import NumberFormat from 'react-number-format';

interface AmountProps {
  quantity: string;
  unit: string;
} 

export class Amount extends React.Component<AmountProps, {}> {
  render() {
    return (
      <NumberFormat 
        value={this.props.quantity} 
        displayType={'text'} 
        thousandSeparator={true} 
        suffix={" " + this.props.unit} 
        renderText={value => <div>{value}</div>}
      />
    );
  }
}
