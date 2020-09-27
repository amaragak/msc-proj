import React from "react";
import { RecordType } from "@daml.js/app-0.0.1/lib/Record";
import { TransportationRequest, NewTransportationOrder, ActiveTransportationOrder } from "@daml.js/app-0.0.1/lib/Product";
import { RecordDetailsTag } from "../../../Types/Record";
import { SelectInput } from "../../Input/SelectInput";
import { productTypeFromId } from "../../../Types/ProductType";
import { RecordTable } from "../../DataDisplay/Tables/RecordTable";
import { RootState } from "../../../Redux/State/RootState";
import { UserState } from "../../../Redux/State/UserState";
import { connect } from "react-redux";
import { uiDate } from "../../../Utils/DateFormat";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { styles, StyleProps } from "./styles";
import { withStyles } from "@material-ui/core/styles";
import { GenericTable } from "../../DataDisplay/Tables/GenericTable";

interface StateProps {
  user: UserState;
}

type TransportationRecordsPageComponentProps = StateProps & StyleProps;

interface TransportationRecordsPageComponentState {
  recordType: string;
}

const START = "Transportation Start Records";
const END = "Transportation End Records";
const REQUEST = "Transportation Requests";
const NEWORDER = "New Transportation Orders";
const ACTIVE = "Active Transportation Orders";

const Options: string[] = [
  START,
  END,
  REQUEST,
  NEWORDER,
  ACTIVE
];

class TransportationRecordsPageComponent extends React.Component<TransportationRecordsPageComponentProps, TransportationRecordsPageComponentState> {
  constructor(props: TransportationRecordsPageComponentProps) {
    super(props);
    this.state = { recordType: START };
  }

  private renderTable() {
    const { user, classes } = this.props;
    switch (this.state.recordType) {
      case START:
        return (
          <div key={START}>
            <RecordTable
              query={{ recordType: RecordType.TRANSPORTATION_START }}
              user={user}
              columnNames={[
                "Transport ID",
                "Transporter",
                "Owner",
                "Type",
                "Label(s)",
                "Amount",
                "Start Location Name",
                "Start Country",
                "Start Time",
              ]}
              recordToRow={ record => {
                if (record.details.tag !== RecordDetailsTag.TRANSPORTATION_START) return { entries: [] };
                return { entries: [
                  record.details.value.transportId,
                  record.actor,
                  record.productOwner,
                  productTypeFromId(record.details.value.productForTransport.typeId)?.name,
                  record.details.value.productForTransport.labels.join(", "),
                  record.details.value.productForTransport.amount.quantity + " " + record.details.value.productForTransport.amount.unit,
                  record.details.value.startLocation.name,
                  record.details.value.startLocation.country,
                  uiDate(record.details.value.startTime),
                ]}
              }}
            />
          </div>
        );
      case END:
        return (
          <div key={END}>
            <RecordTable
              query={{ recordType: RecordType.TRANSPORTATION_END }}
              user={user}
              columnNames={[
                "Transport ID",
                "Transporter",
                "Owner",
                "Type",
                "Label(s)",
                "Amount",
                "End Location Name",
                "End Country",
                "End Time"
              ]}
              recordToRow={ record => {
                if (record.details.tag !== RecordDetailsTag.TRANSPORTATION_END) return { entries: [] };
                return { entries: [
                  record.details.value.transportId,
                  record.actor,
                  record.productOwner,
                  productTypeFromId(record.details.value.productForTransport.typeId)?.name,
                  record.details.value.productForTransport.labels.join(", "),
                  record.details.value.productForTransport.amount.quantity + " " + record.details.value.productForTransport.amount.unit,
                  record.details.value.endLocation.name,
                  record.details.value.endLocation.country,
                  uiDate(record.details.value.endTime)
                ]}
              }}
            />
          </div>
        );
      case REQUEST:
        return (
          <div key={REQUEST}>
            <GenericTable<TransportationRequest, typeof TransportationRequest>
              template={TransportationRequest}
              user={user}
              useStream={false}
              getId={record => record.productId}
              getVersion={record => ""}
              classes={classes}
              columnNames={[
                "Transporter",
                "Owner",
                "Type",
                "Label(s)",
                "Amount",
                "Start Location Name",
                "Start Country",
                "End Location Name",
                "End Country",
              ]}
              recordToRow={ record => {
                return { entries: [
                  record.transporter,
                  record.productOwner,
                  productTypeFromId(record.productForTransport.typeId)?.name,
                  record.productForTransport.labels.join(", "),
                  record.productForTransport.amount.quantity + " " + record.productForTransport.amount.unit,
                  record.startLocation.name,
                  record.startLocation.country,
                  record.endLocation.name,
                  record.endLocation.country
                ]}
              }}
            />
          </div>
        );
      case NEWORDER:
        return (
          <div key={NEWORDER}>
            <GenericTable<NewTransportationOrder, typeof NewTransportationOrder>
              template={NewTransportationOrder}
              user={user}
              useStream={false}
              getId={record => record.transportId}
              getVersion={record => ""}
              classes={classes}
              columnNames={[
                "Transporter",
                "Owner",
                "Type",
                "Label(s)",
                "Amount",
                "Start Location Name",
                "Start Country",
                "End Location Name",
                "End Country",
                "Handover Time"
              ]}
              recordToRow={ record => {
                return { entries: [
                  record.transporter,
                  record.productOwner,
                  productTypeFromId(record.productForTransport.typeId)?.name,
                  record.productForTransport.labels.join(", "),
                  record.productForTransport.amount.quantity + " " + record.productForTransport.amount.unit,
                  record.startLocation.name,
                  record.startLocation.country,
                  record.endLocation.name,
                  record.endLocation.country,
                  record.handoverTime
                ]}
              }}
            />
          </div>
        );
      case ACTIVE:
        return (
          <div key={ACTIVE}>
            <GenericTable<ActiveTransportationOrder, typeof ActiveTransportationOrder>
              template={ActiveTransportationOrder}
              user={user}
              useStream={false}
              getId={record => record.transportId}
              getVersion={record => ""}
              classes={classes}
              columnNames={[
                "Transporter",
                "Owner",
                "Type",
                "Label(s)",
                "Amount",
                "Start Location Name",
                "Start Country",
                "End Location Name",
                "End Country",
                "Start Time"
              ]}
              recordToRow={ record => {
                return { entries: [
                  record.transporter,
                  record.productOwner,
                  productTypeFromId(record.productForTransport.typeId)?.name,
                  record.productForTransport.labels.join(", "),
                  record.productForTransport.amount.quantity + " " + record.productForTransport.amount.unit,
                  record.startLocation.name,
                  record.startLocation.country,
                  record.endLocation.name,
                  record.endLocation.country,
                  record.startTime
                ]}
              }}
            />
          </div>
        );
      default: return null;
    }
  }

  render() {
    const { user, classes } = this.props;
    if (!user.loggedIn) return null;

    return (
      <>
        <Typography variant="h5" component="h5" align="left">
          Transportation
        </Typography>
        <Typography variant="body2" align="left">
          View transportation-related records that are stored on the ledger and visible to you.
        </Typography>
        <Divider className={classes.divider}/>
        <SelectInput 
          label="Record Type"
          options={Options}
          value={this.state.recordType}
          onChange={recordType => this.setState({ recordType })}
          fullWidth={false}
        />
        {this.renderTable()}
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.user
});

const TransportationRecordsPageWithStyles = withStyles(styles, { withTheme: true })(TransportationRecordsPageComponent);
export const TransportationRecordsPage = connect(mapStateToProps, null)(TransportationRecordsPageWithStyles);
