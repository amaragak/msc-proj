import React from "react";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

interface AcceptDeclineProps {
  onChange: (accept: boolean) => void;
  accept: boolean;
}

export class AcceptDecline extends React.Component<AcceptDeclineProps, {}> {
  render() {
    return (
      <FormControl component="fieldset">
        <RadioGroup row aria-label="acceptdecline" name="acceptdecline" value={this.props.accept ? "accept" : "decline"} onChange={e => this.props.onChange(e.target.value === "accept")}>
          <FormControlLabel value="decline" control={<Radio />} label="Decline" />
          <FormControlLabel value="accept" control={<Radio />} label="Accept" />
        </RadioGroup>
      </FormControl>
    );
  }
}
