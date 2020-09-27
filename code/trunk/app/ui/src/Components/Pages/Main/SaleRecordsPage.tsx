import React from "react";
import { RecordDetailsTag } from "../../../Types/Record";
import { RecordTable } from "../../DataDisplay/Tables/RecordTable";
import { GenericTable } from "../../DataDisplay/Tables/GenericTable";
import { RootState } from "../../../Redux/State/RootState";
import { UserState } from "../../../Redux/State/UserState";
import { connect } from "react-redux";
import { uiDate } from "../../../Utils/DateFormat";
import { RecordType } from "@daml.js/app-0.0.1/lib/Record";
import { SaleRequest } from "@daml.js/app-0.0.1/lib/Product";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { styles, StyleProps } from "./styles";
import { withStyles } from "@material-ui/core/styles";
import { productTypeFromId } from "../../../Types/ProductType";
import { SelectInput } from "../../Input/SelectInput";

interface StateProps {
  user: UserState;
}

type SaleRecordsPageComponentProps = StateProps & StyleProps;

interface SaleRecordsPageComponentState {
  recordType: string;
}

const SALE = "Sale Records";
const REQUEST = "Sale Requests";

const Options: string[] = [
  SALE,
  REQUEST,
];

export class SaleRecordsPageComponent extends React.Component<SaleRecordsPageComponentProps, SaleRecordsPageComponentState> {
  constructor(props: SaleRecordsPageComponentProps) {
    super(props);
    this.state = { recordType: SALE };
  }

  private renderTable() {
    const { user, classes } = this.props;
    switch (this.state.recordType) {
      case SALE:
        return (
          <div key={SALE}>
            <RecordTable
              query={{ recordType: RecordType.SALE }}
              user={user}
              columnNames={[
                "Old Owner",
                "New Owner",
                "Product Type",
                "Product Label(s)",
                "Amount",
                "Price",
                "Sale Time"
              ]}
              recordToRow={ record => {
                if (record.details.tag !== RecordDetailsTag.SALE) return { entries: [] };
                return { entries: [
                  record.actor,
                  record.details.value.buyer,
                  productTypeFromId(record.details.value.product.typeId).name,
                  record.details.value.product.labels.join(", "),
                  record.details.value.product.amount.quantity + " " + record.details.value.product.amount.unit,
                  record.details.value.currency + " " + record.details.value.price,
                  uiDate(record.details.value.time)
                ]}
              }}
            />
          </div>
        );
      case REQUEST:
        return (
          <div key={REQUEST}>
            <GenericTable<SaleRequest, typeof SaleRequest>
              user={user}
              columnNames={[
                "Current Owner",
                "Offered To",
                "Type",
                "Label(s)",
                "Amount",
                "Price"
              ]}
              getId={record => record.productId}
              getVersion={record => ""}
              classes={classes}
              useStream={false}
              template={SaleRequest}
              recordToRow={ record => {
                return { entries: [
                  record.productOwner,
                  record.buyer,
                  productTypeFromId(record.productInfo.typeId)?.name,
                  record.productInfo.labels.join(", "),
                  record.productInfo.amount.quantity + " " + record.productInfo.amount.unit,
                  record.currency + " " + record.price
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
          Sales
        </Typography>
        <Typography variant="body2" align="left">
          View Sale-related records that are stored on the ledger and visible to you.
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

const SaleRecordsPageWithStyles = withStyles(styles, { withTheme: true })(SaleRecordsPageComponent);
export const SaleRecordsPage = connect(mapStateToProps, null)(SaleRecordsPageWithStyles);
