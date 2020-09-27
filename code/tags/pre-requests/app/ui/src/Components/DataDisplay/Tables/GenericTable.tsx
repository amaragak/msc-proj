import React from "react";
import { Template } from "@daml/types";
import { Stream } from "../../../DamlHelpers/Stream";
import { UserState } from "../../../Redux/State/UserState";
import Ledger from "@daml/ledger";
import { httpBaseUrl, wsBaseUrl } from "../../../config";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';

export interface GenericTableRow {
  entries: (string | undefined)[]
}

export interface GenericTableProps<Record, Templ extends Template<any,any,any>> {
  user: UserState;
  template: Templ;
  columnNames: string[];
  recordToRow: (record: Record) => GenericTableRow;
  query?: any;
  selectable?: boolean;
  onRecordSelected?: (record: Record | undefined) => void;
  classes: any;
  comparator?: (a: Record, b: Record) => number;
  getId: (a: Record) => string;
  getVersion: (a: Record) => string;
  useStream: boolean;
}

interface GenericTableState<Record> {
  records: Record[];
  isLoading: boolean;
  selected: Selection;
}

interface Selection {
  id: string;
  version: string;
}

const nothingSelected = { id: "", version: "" };

export class GenericTable<Record, Templ extends Template<any,any,any>> extends React.Component<GenericTableProps<Record, Templ>, GenericTableState<Record>> {
  constructor(props: GenericTableProps<Record, Templ>) {
    super(props);
    this.state = { records: [], isLoading: true, selected: nothingSelected }
  }
  
  private stream: Stream<Templ> | undefined = undefined;

  componentDidMount() {
    if (this.props.useStream) this.initialiseStream();
    else this.fetchData();
  }

  async fetchData() {
    const { user, template, query, comparator, getId, getVersion, onRecordSelected } = this.props;
    if (!user.loggedIn) return;
    const ledger = new Ledger({ token: user.token, httpBaseUrl, wsBaseUrl });
    const results = await ledger.query(template, query);
    const records = results.map(contract => contract.payload);
    this.setState({ ...this.state, isLoading: false, records });
  }

  initialiseStream() {
    const { user, template, query, comparator, getId, getVersion, onRecordSelected } = this.props;
    if (!user.loggedIn) return;
    const ledger = new Ledger({ token: user.token, httpBaseUrl, wsBaseUrl });
    this.stream = new Stream(ledger, template, query);
    this.stream.onLive(() => this.setState({ ...this.state, isLoading: false }));
    this.stream.onChange(results => {
      const records = results.map(contract => contract.payload);
      let nextSelection: Selection = this.state.selected;
      if (this.state.selected.id) {
        const selectedRecord = records.find(record => getId(record) === this.state.selected.id);
        if (!selectedRecord) {
          onRecordSelected && onRecordSelected(undefined);
          nextSelection = nothingSelected;
        } else if (getVersion(selectedRecord) !== this.state.selected.version) {
          const id = getId(selectedRecord);
          const version = getVersion(selectedRecord);
          onRecordSelected && onRecordSelected(selectedRecord);
          nextSelection = { id, version };
        }
      }
      if (comparator) records.sort(comparator);
      this.setState({ ...this.state, records, selected: nextSelection });
    });
    this.stream.onClose(closeEvent => {
      console.error('streamQuery: web socket closed', closeEvent);
      this.setState({ ...this.state, isLoading: true });
    });
  }

  componentWillUnmount() {
    this.stream?.close();
  }

  renderEmpty() {
    const { classes } = this.props;
    return (<div className={classes.empty}>No records to show</div>)
  }

  onRowClick(row: number) {
    const { onRecordSelected, getId, getVersion } = this.props;
    if (!this.props.selectable) return;
    const record = this.state.records[row];
    const id = getId(record);
    if (this.state.selected.id === id) {
      this.setState({ ...this.state, selected: nothingSelected });
      onRecordSelected && onRecordSelected(undefined);
    } else {
      const version = getVersion(record);
      this.setState({ ...this.state, selected: { id, version } });
      onRecordSelected && onRecordSelected(this.state.records[row]);
    }
  }

  render () {
    const { classes, columnNames, recordToRow, selectable, getId } = this.props;
    const { records, isLoading } = this.state;

    if (isLoading) return (null);
    if (!records || records.length === 0) return this.renderEmpty();

    return (
      <TableContainer className={classes.container} component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow className={classes.tableRow}>
              {columnNames.map((name, i) => <TableCell key={i} className={classes.tableHeaderCell}>{name}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record, i) => (
              <TableRow 
                key={i} 
                className={selectable ? classes.selectableRow : classes.tableRow} 
                hover={selectable}
                selected={this.state.selected.id === getId(record)}
                onClick={() => this.onRowClick(i)}
              >
                {recordToRow(record).entries.map((entry, i) => <TableCell key={i} className={classes.tableCell}>{entry}</TableCell>)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
