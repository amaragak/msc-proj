import React from "react";
import { GenericTable, GenericTableRow } from "./GenericTable";
import { Record } from "@daml.js/app-0.0.1/lib/Record";
import { RecordTemplate } from "../../../Types/Record";
import { styles, StyleProps } from "./styles";
import { withStyles } from "@material-ui/core/styles";
import { UserState } from "../../../Redux/State/UserState";

export interface RecordTableComponentOwnProps{
  user: UserState;
  columnNames: string[];
  recordToRow: (record: Record) => GenericTableRow;
  query?: any;
}

type RecordTableComponentProps = RecordTableComponentOwnProps & StyleProps;

class RecordTableComponent extends React.Component<RecordTableComponentProps, {}> {
  render() {
    const { user, columnNames, recordToRow, query, classes } = this.props;
    return(
      <GenericTable<Record, RecordTemplate>
        useStream={false}
        user={user}
        columnNames={columnNames}
        recordToRow={recordToRow}
        query={query}
        classes={classes}
        template={Record}
        getId={a => a.recordId}
        getVersion={a => ""}
        comparator={(a, b) => new Date(b.completionTime).getTime() - new Date(a.completionTime).getTime()}
      />
    );
  }
}

export const RecordTable = withStyles(styles, { withTheme: true })(RecordTableComponent);
