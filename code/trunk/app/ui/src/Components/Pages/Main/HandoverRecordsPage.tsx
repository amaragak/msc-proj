import React from "react";
import { RecordDetailsTag } from "../../../Types/Record";
import { RecordTable } from "../../DataDisplay/Tables/RecordTable";
import { GenericTable } from "../../DataDisplay/Tables/GenericTable";
import { RootState } from "../../../Redux/State/RootState";
import { UserState } from "../../../Redux/State/UserState";
import { connect } from "react-redux";
import { uiDate } from "../../../Utils/DateFormat";
import { RecordType } from "@daml.js/app-0.0.1/lib/Record";
import { HandoverRequest } from "@daml.js/app-0.0.1/lib/Product";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { styles, StyleProps } from "./styles";
import { withStyles } from "@material-ui/core/styles";
import { productTypeFromId } from "../../../Types/ProductType";
import { SelectInput } from "../../Input/SelectInput";

interface StateProps {
  user: UserState;
}

type HandoverRecordsPageComponentProps = StateProps & StyleProps;

interface HandoverRecordsPageComponentState {
  recordType: string;
}

const HANDOVER = "Handover Records";
const REQUEST = "Handover Requests";

const Options: string[] = [
  HANDOVER,
  REQUEST,
];

export class HandoverRecordsPageComponent extends React.Component<HandoverRecordsPageComponentProps, HandoverRecordsPageComponentState> {
  constructor(props: HandoverRecordsPageComponentProps) {
    super(props);
    this.state = { recordType: HANDOVER };
  }

  private renderTable() {
    const { user, classes } = this.props;
    switch (this.state.recordType) {
      case HANDOVER:
        return (
          <div key={HANDOVER}>
            <RecordTable
              query={{ recordType: RecordType.HANDOVER }}
              user={user}
              columnNames={[
                "Owner",
                "Old Handler",
                "New Handler",
                "Product Type",
                "Product Label(s)",
                "Amount",
                "Handover Time"
              ]}
              recordToRow={ record => {
                if (record.details.tag !== RecordDetailsTag.HANDOVER) return { entries: [] };
                return { entries: [
                  record.productOwner,
                  record.details.value.oldHandler,
                  record.details.value.newHandler,
                  productTypeFromId(record.details.value.product.typeId).name,
                  record.details.value.product.labels.join(", "),
                  record.details.value.product.amount.quantity + " " + record.details.value.product.amount.unit,
                  uiDate(record.details.value.time)
                ]}
              }}
            />
          </div>
        );
      case REQUEST:
        return (
          <div key={REQUEST}>
            <GenericTable<HandoverRequest, typeof HandoverRequest>
              user={user}
              columnNames={[
                "Owner",
                "Current Handler",
                "Requested Handler",
                "Type",
                "Label(s)",
                "Amount",
              ]}
              getId={record => record.productId}
              getVersion={record => ""}
              classes={classes}
              useStream={false}
              template={HandoverRequest}
              recordToRow={ record => {
                return { entries: [
                  record.productOwner,
                  record.oldHandler,
                  record.newHandler,
                  productTypeFromId(record.productInfo.typeId)?.name,
                  record.productInfo.labels.join(", "),
                  record.productInfo.amount.quantity + " " + record.productInfo.amount.unit
                ]}
              }}
            />
          </div>
        )
      default: return null;
    }
  }

  render() {
    const { user, classes } = this.props;
    if (!user.loggedIn) return null;

    return (
      <>
        <Typography variant="h5" component="h5" align="left">
          Handovers
        </Typography>
        <Typography variant="body2" align="left">
          View handover-related records that are stored on the ledger and visible to you.
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

const HandoverRecordsPageWithStyles = withStyles(styles, { withTheme: true })(HandoverRecordsPageComponent);
export const HandoverRecordsPage = connect(mapStateToProps, null)(HandoverRecordsPageWithStyles);
