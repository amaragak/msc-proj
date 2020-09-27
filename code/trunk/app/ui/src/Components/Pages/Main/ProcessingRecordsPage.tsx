import React from "react";
import { RecordDetailsTag } from "../../../Types/Record";
import { productTypeFromId } from "../../../Types/ProductType";
import { RecordTable } from "../../DataDisplay/Tables/RecordTable";
import { GenericTable } from "../../DataDisplay/Tables/GenericTable";
import { RootState } from "../../../Redux/State/RootState";
import { UserState } from "../../../Redux/State/UserState";
import { connect } from "react-redux";
import { uiDate } from "../../../Utils/DateFormat";
import { RecordType } from "@daml.js/app-0.0.1/lib/Record";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { styles, StyleProps } from "./styles";
import { withStyles } from "@material-ui/core/styles";
import { ProcessingRequest, NewProcessingOrder, ActiveProcessingOrder } from "@daml.js/app-0.0.1/lib/Product";
import { SelectInput } from "../../Input/SelectInput";

interface StateProps {
  user: UserState;
}

type ProcessingRecordsPageComponentProps = StateProps & StyleProps;

interface ProcessingRecordsPageComponentState {
  recordType: string;
}

const START = "Processing Start Records";
const END = "Processing End Records";
const REQUEST = "Processing Requests";
const NEWORDER = "New Processing Orders";
const ACTIVE = "Active Processing Orders";

const Options: string[] = [
  START,
  END,
  REQUEST,
  NEWORDER,
  ACTIVE
];

export class ProcessingRecordsPageComponent extends React.Component<ProcessingRecordsPageComponentProps, ProcessingRecordsPageComponentState> {
  constructor(props: ProcessingRecordsPageComponentProps) {
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
              query={{ recordType: RecordType.PROCESSING_START }}
              user={user}
              columnNames={[
                "Process ID",
                "Processor",
                "Owner",
                "Input Type",
                "Input Label(s)",
                "Input Amount",
                "Location Name",
                "Country",
                "Start Time"
              ]}
              recordToRow={ record => {
                if (record.details.tag !== RecordDetailsTag.PROCESSING_START) return { entries: [] };
                return { entries: [
                  record.details.value.processId,
                  record.actor,
                  record.productOwner,
                  productTypeFromId(record.details.value.inputProduct.typeId)?.name,
                  record.details.value.inputProduct.labels.join(", "),
                  record.details.value.inputProduct.amount.quantity + " " + record.details.value.inputProduct.amount.unit,
                  record.details.value.location.name,
                  record.details.value.location.country,
                  uiDate(record.details.value.startTime),
                ]}
              }}
            />
          </div>
        );
      case END:
        return (
          <RecordTable
            query={{ recordType: RecordType.PROCESSING_END }}
            user={user}
            columnNames={[
              "Process ID",
              "Processor",
              "Owner",
              "Output Type",
              "Output Label",
              "Output Amount",
              "Location Name",
              "Country",
              "End Time"
            ]}
            recordToRow={ record => {
              if (record.details.tag !== RecordDetailsTag.PROCESSING_END) return { entries: [] };
              return { entries: [
                record.details.value.processId,
                record.actor,
                record.productOwner,
                productTypeFromId(record.details.value.outputProduct.typeId)?.name,
                record.details.value.outputProduct.labels[0],
                record.details.value.outputProduct.amount.quantity + " " + record.details.value.outputProduct.amount.unit,
                record.details.value.location.name,
                record.details.value.location.country,
                uiDate(record.details.value.endTime)
              ]}
            }}
          />
        );
      case REQUEST:
        return (
          <GenericTable<ProcessingRequest, typeof ProcessingRequest>
            user={user}
            columnNames={[
              "Processor",
              "Owner",
              "Input Type",
              "Input Label(s)",
              "Input Amount",
              "Output Type"
            ]}
            getId={record => record.productId}
            getVersion={record => ""}
            classes={classes}
            useStream={false}
            template={ProcessingRequest}
            recordToRow={ record => {
              return { entries: [
                record.processor,
                record.productOwner,
                productTypeFromId(record.inputProduct.typeId)?.name,
                record.inputProduct.labels.join(", "),
                record.inputProduct.amount.quantity + " " + record.inputProduct.amount.unit
              ]}
            }}
          />
        );
      case NEWORDER:
        return (
          <GenericTable<NewProcessingOrder, typeof NewProcessingOrder>
            user={user}
            columnNames={[
              "Processor",
              "Owner",
              "Input Type",
              "Input Label(s)",
              "Input Amount",
              "Output Type",
              "Handover Time"
            ]}
            getId={record => record.processId}
            getVersion={record => ""}
            classes={classes}
            useStream={false}
            template={NewProcessingOrder}
            recordToRow={ record => {
              return { entries: [
                record.processor,
                record.productOwner,
                productTypeFromId(record.inputProduct.typeId)?.name,
                record.inputProduct.labels.join(", "),
                record.inputProduct.amount.quantity + " " + record.inputProduct.amount.unit,
                record.handoverTime
              ]}
            }}
          />
        );
      case ACTIVE:
        return (
          <GenericTable<ActiveProcessingOrder, typeof ActiveProcessingOrder>
            user={user}
            columnNames={[
              "Processor",
              "Owner",
              "Input Type",
              "Input Label(s)",
              "Input Amount",
              "Output Type",
              "Start Time"
            ]}
            getId={record => record.processId}
            getVersion={record => ""}
            classes={classes}
            useStream={false}
            template={ActiveProcessingOrder}
            recordToRow={ record => {
              return { entries: [
                record.processor,
                record.productOwner,
                productTypeFromId(record.inputProduct.typeId)?.name,
                record.inputProduct.labels.join(", "),
                record.inputProduct.amount.quantity + " " + record.inputProduct.amount.unit,
                record.startTime
              ]}
            }}
          />
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
          Processing
        </Typography>
        <Typography variant="body2" align="left">
          View processing-related records that are stored on the ledger and visible to you.
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

const ProcessingRecordsPageWithStyles = withStyles(styles, { withTheme: true })(ProcessingRecordsPageComponent);
export const ProcessingRecordsPage = connect(mapStateToProps, null)(ProcessingRecordsPageWithStyles);
