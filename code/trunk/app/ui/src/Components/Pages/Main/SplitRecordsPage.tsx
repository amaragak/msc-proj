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

type SplitRecordsPageComponentProps = StateProps & StyleProps;

interface SplitRecordsPageComponentState {
  editorOpen: boolean;
}

class SplitRecordsPageComponent extends React.Component<SplitRecordsPageComponentProps, SplitRecordsPageComponentState> {
  constructor(props: SplitRecordsPageComponentProps) {
    super(props);
    this.state = { editorOpen: false };
  }

  render() {
    const { user, classes } = this.props;
    if (!user.loggedIn) return null;

    return (
      <>
        <Typography variant="h5" component="h5" align="left">
          Split Records
        </Typography>
        <Typography variant="body2" align="left">
          View Split records that are stored on the ledger and visible to you.
        </Typography>
        <Divider className={classes.divider}/>
        <RecordTable
          query={{ recordType: RecordType.SPLIT }}
          user={user}
          columnNames={[
            "Original Amount",
            "Original Description",
            "Split A Amount",
            "Split A Description",
            "Split B Amount",
            "Split B Description",
            "Time"
          ]}
          recordToRow={ record => {
            if (record.details.tag !== RecordDetailsTag.SPLIT) return { entries: [] };
            return { entries: [
              record.details.value.oldProduct.amount.quantity + " " + record.details.value.oldProduct.amount.unit,
              record.details.value.oldDescription,
              record.details.value.newProductA.amount.quantity + " " + record.details.value.newProductA.amount.unit,
              record.details.value.newDescriptionA,
              record.details.value.newProductB.amount.quantity + " " + record.details.value.newProductB.amount.unit,
              record.details.value.newDescriptionB,
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

const SplitRecordsPageWithStyles = withStyles(styles, { withTheme: true })(SplitRecordsPageComponent);
export const SplitRecordsPage = connect(mapStateToProps, null)(SplitRecordsPageWithStyles);
