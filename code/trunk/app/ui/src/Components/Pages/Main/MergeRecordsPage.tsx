import React from "react";
import { RecordType } from "@daml.js/app-0.0.1/lib/Record";
import { RecordDetailsTag } from "../../../Types/Record";
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

type MergeRecordsPageComponentProps = StateProps & StyleProps;

interface MergeRecordsPageComponentState {
  editorOpen: boolean;
}

class MergeRecordsPageComponent extends React.Component<MergeRecordsPageComponentProps, MergeRecordsPageComponentState> {
  constructor(props: MergeRecordsPageComponentProps) {
    super(props);
    this.state = { editorOpen: false };
  }

  render() {
    const { user, classes } = this.props;
    if (!user.loggedIn) return null;

    return (
      <>
        <Typography variant="h5" component="h5" align="left">
          Merge Records
        </Typography>
        <Typography variant="body2" align="left">
          View Merge records that are stored on the ledger and visible to you.
        </Typography>
        <Divider className={classes.divider}/>
        <RecordTable
          query={{ recordType: RecordType.MERGE }}
          user={user}
          columnNames={[
            "Input A Amount",
            "Input A Label(s)",
            "Input A Description",
            "Input B Amount",
            "Input B Label(s)",
            "Input B Description",
            "Merged Amount",
            "Merged Labels",
            "Merged Description",
            "Time"
          ]}
          recordToRow={ record => {
            if (record.details.tag !== RecordDetailsTag.MERGE) return { entries: [] };
            return { entries: [
              record.details.value.oldProductA.amount.quantity + " " + record.details.value.oldProductA.amount.unit,
              record.details.value.oldProductA.labels.join(", "),
              record.details.value.oldDescriptionA,
              record.details.value.oldProductB.amount.quantity + " " + record.details.value.oldProductB.amount.unit,
              record.details.value.oldProductB.labels.join(", "),
              record.details.value.oldDescriptionB,
              record.details.value.newProduct.amount.quantity + " " + record.details.value.newProduct.amount.unit,
              record.details.value.newProduct.labels.join(", "),
              record.details.value.newDescription,
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

const MergeRecordsPageWithStyles = withStyles(styles, { withTheme: true })(MergeRecordsPageComponent);
export const MergeRecordsPage = connect(mapStateToProps, null)(MergeRecordsPageWithStyles);
