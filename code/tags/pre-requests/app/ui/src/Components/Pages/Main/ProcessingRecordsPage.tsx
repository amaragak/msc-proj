import React from "react";
import { RecordDetailsTag } from "../../../Types/Record";
import { productTypeFromId } from "../../../Types/ProductType";
import { RecordTable } from "../../DataDisplay/Tables/RecordTable";
import { RootState } from "../../../Redux/State/RootState";
import { UserState } from "../../../Redux/State/UserState";
import { connect } from "react-redux";
import { uiDate } from "../../../Utils/DateFormat";
import { RecordType } from "@daml.js/app-0.0.1/lib/Record";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { styles, StyleProps } from "./styles";
import { withStyles } from "@material-ui/core/styles";

interface StateProps {
  user: UserState;
}

type ProcessingRecordsPageComponentProps = StateProps & StyleProps;

interface ProcessingRecordsPageComponentState {
  editorOpen: boolean;
}

export class ProcessingRecordsPageComponent extends React.Component<ProcessingRecordsPageComponentProps, ProcessingRecordsPageComponentState> {
  constructor(props: ProcessingRecordsPageComponentProps) {
    super(props);
    this.state = { editorOpen: false };
  }

  render() {
    const { user, classes } = this.props;
    if (!user.loggedIn) return null;

    return (
      <>
        <Typography variant="h5" component="h5" align="left">
          Processing Records
        </Typography>
        <Typography variant="body2" component="body" align="left">
          View processing records that are visible to you.
        </Typography>
        <Divider className={classes.divider}/>
        <RecordTable
          query={{ recordType: RecordType.PROCESSING }}
          user={user}
          columnNames={[
            "Processor",
            "Owner",
            "Input Type",
            "Input Label(s)",
            "Input Amount",
            "Output Type",
            "Output Label",
            "Output Amount",
            "Location Name",
            "Country",
            "Start Time",
            "End Time"
          ]}
          recordToRow={ record => {
            if (record.details.tag !== RecordDetailsTag.PROCESSING) return { entries: [] };
            return { entries: [
              record.actor,
              record.productOwner,
              productTypeFromId(record.details.value.inputProduct.typeId)?.name,
              record.details.value.inputProduct.labels.join(", "),
              record.details.value.inputProduct.amount.quantity + " " + record.details.value.inputProduct.amount.unit,
              productTypeFromId(record.details.value.outputProduct.typeId)?.name,
              record.details.value.outputProduct.labels[0],
              record.details.value.outputProduct.amount.quantity + " " + record.details.value.outputProduct.amount.unit,
              record.details.value.location.name,
              record.details.value.location.country,
              uiDate(record.details.value.startTime),
              uiDate(record.details.value.endTime)
            ]}
          }}
        />
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.user
});

const ProcessingRecordsPageWithStyles = withStyles(styles, { withTheme: true })(ProcessingRecordsPageComponent);
export const ProcessingRecordsPage = connect(mapStateToProps, null)(ProcessingRecordsPageWithStyles);
