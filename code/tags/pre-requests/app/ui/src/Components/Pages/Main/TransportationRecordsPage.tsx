import React from "react";
import { RecordType } from "@daml.js/app-0.0.1/lib/Record";
import { RecordDetailsTag } from "../../../Types/Record";
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

interface StateProps {
  user: UserState;
}

type TransportationRecordsPageComponentProps = StateProps & StyleProps;

interface TransportationRecordsPageComponentState {
  editorOpen: boolean;
}

class TransportationRecordsPageComponent extends React.Component<TransportationRecordsPageComponentProps, TransportationRecordsPageComponentState> {
  constructor(props: TransportationRecordsPageComponentProps) {
    super(props);
    this.state = { editorOpen: false };
  }

  render() {
    const { user, classes } = this.props;
    if (!user.loggedIn) return null;

    return (
      <>
        <Typography variant="h5" component="h5" align="left">
          Transportation Records
        </Typography>
        <Typography variant="body2" component="body" align="left">
          View transportation records that are visible to you.
        </Typography>
        <Divider className={classes.divider}/>
        <RecordTable
          query={{ recordType: RecordType.TRANSPORTATION }}
          user={user}
          columnNames={[
            "Transporter",
            "Owner",
            "Type",
            "Label(s)",
            "Amount",
            "Start Location Name",
            "Start Country",
            "Start Time",
            "End Location Name",
            "End Country",
            "End Time"
          ]}
          recordToRow={ record => {
            if (record.details.tag !== RecordDetailsTag.TRANSPORTATION) return { entries: [] };
            return { entries: [
              record.actor,
              record.productOwner,
              productTypeFromId(record.details.value.product.typeId)?.name,
              record.details.value.product.labels.join(", "),
              record.details.value.product.amount.quantity + " " + record.details.value.product.amount.unit,
              record.details.value.startLocation.name,
              record.details.value.startLocation.country,
              uiDate(record.details.value.startTime),
              record.details.value.endLocation.name,
              record.details.value.endLocation.country,
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

const TransportationRecordsPageWithStyles = withStyles(styles, { withTheme: true })(TransportationRecordsPageComponent);
export const TransportationRecordsPage = connect(mapStateToProps, null)(TransportationRecordsPageWithStyles);
