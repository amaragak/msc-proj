import React from "react";
import { RecordType } from "@daml.js/app-0.0.1/lib/Record";
import { RecordDetailsTag } from "../../../Types/Record";
import { productTypeFromId } from "../../../Types/ProductType";
import { plotFromPlotId } from "../../../Types/Plot";
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

type ProductionRecordsPageComponentProps = StateProps & StyleProps;

interface ProductionRecordsPageComponentState {
  editorOpen: boolean;
}

class ProductionRecordsPageComponent extends React.Component<ProductionRecordsPageComponentProps, ProductionRecordsPageComponentState> {
  constructor(props: ProductionRecordsPageComponentProps) {
    super(props);
    this.state = { editorOpen: false };
  }

  render() {
    const { user, classes } = this.props;
    if (!user.loggedIn) return null;

    return (
      <>
        <Typography variant="h5" component="h5" align="left">
          Production Records
        </Typography>
        <Typography variant="body2" component="body" align="left">
          View production records that are visible to you.
        </Typography>
        <Divider className={classes.divider}/>
        <RecordTable
          query={{ recordType: RecordType.PRODUCTION }}
          user={user}
          columnNames={[
            "Producer",
            "Owner",
            "Type",
            "Label",
            "Amount",
            "Farmer",
            "Plot",
            "Location Name",
            "Country",
            "Time"
          ]}
          recordToRow={ record => {
            if (record.details.tag !== RecordDetailsTag.PRODUCTION) return { entries: [] };
            const plot = plotFromPlotId(record.details.value.plotId);
            return { entries: [
              record.actor,
              record.productOwner,
              productTypeFromId(record.details.value.product.typeId)?.name,
              record.details.value.product.labels[0],
              record.details.value.product.amount.quantity + " " + record.details.value.product.amount.unit,
              "" + plot?.farmer,
              "" + plot?.plotNumber,
              record.details.value.location.name,
              record.details.value.location.country,
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

const ProductionRecordsPageWithStyles = withStyles(styles, { withTheme: true })(ProductionRecordsPageComponent);
export const ProductionRecordsPage = connect(mapStateToProps, null)(ProductionRecordsPageWithStyles);
