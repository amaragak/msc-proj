import React from "react";
import { RecordDetailsTag } from "../../../Types/Record";
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

type HandoverRecordsPageComponentProps = StateProps & StyleProps;

interface HandoverRecordsPageComponentState {
  editorOpen: boolean;
}

export class HandoverRecordsPageComponent extends React.Component<HandoverRecordsPageComponentProps, HandoverRecordsPageComponentState> {
  constructor(props: HandoverRecordsPageComponentProps) {
    super(props);
    this.state = { editorOpen: false };
  }

  render() {
    const { user, classes } = this.props;
    if (!user.loggedIn) return null;

    return (
      <>
        <Typography variant="h5" component="h5" align="left">
          Handover Records
        </Typography>
        <Typography variant="body2" component="body" align="left">
          View handover records that are visible to you.
        </Typography>
        <Divider className={classes.divider}/>
        <RecordTable
          query={{ recordType: RecordType.HANDOVER }}
          user={user}
          columnNames={[
            "Owner",
            "Old Handler",
            "New Handler",
            "Time"
          ]}
          recordToRow={ record => {
            if (record.details.tag !== RecordDetailsTag.HANDOVER) return { entries: [] };
            return { entries: [
              record.productOwner,
              record.actor,
              record.details.value.newHandler,
              uiDate(record.details.value.time)
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

const HandoverRecordsPageWithStyles = withStyles(styles, { withTheme: true })(HandoverRecordsPageComponent);
export const HandoverRecordsPage = connect(mapStateToProps, null)(HandoverRecordsPageWithStyles);
