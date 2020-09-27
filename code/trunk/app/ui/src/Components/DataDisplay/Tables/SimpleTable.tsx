import React from "react";
import { styles, StyleProps } from "./styles";
import { withStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';

interface SimpleTableComponentOwnProps {
  rows: ({
    header?: boolean;
    field: string;
    value?: string;
    renderValue?: () => JSX.Element;
  } | undefined)[],
  title?: string;
}

type SimpleTableComponentProps = SimpleTableComponentOwnProps & StyleProps;

class SimpleTableComponent extends React.Component<SimpleTableComponentProps, {}> {
  renderRow(i: number) {
    const { classes, rows } = this.props;
    const row = rows[i];
    const renderValueI = () => {
      if (!row) return null;
      if (row.value) return row.value;
      else if (row.renderValue) {
        const foo = row.renderValue; //TS bug?
        if (foo) return foo();
        else return null;
      }
      else return null;
    };
    if (!row) {
      return <tr key={i}><td className={classes.spacer} /></tr>
    }
    return (
      <tr key={i} className={classes.simpleRow}>
        <td className={row.header ? classes.simpleHeader : classes.recordLeft}>
          {row.field}
        </td>
        <td className={classes.recordRight}>
          {renderValueI()}
        </td>
      </tr>
    );
  }

  render() {
    const { classes, rows, title } = this.props;
    return (
      <React.Fragment>
        {!!title &&<Typography variant="h6" component="h1" align="center">
          {title}
        </Typography>}
        <table className={classes.simpleTable}>
          <tbody>
            {rows.map((_row, i) => this.renderRow(i))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export const SimpleTable = withStyles(styles, { withTheme: true })(SimpleTableComponent);
