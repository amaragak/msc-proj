import React from 'react';
import MuiTimeline from '@material-ui/lab/Timeline';
import MuiTimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import MuiTimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { styles, StyleProps, processColor, transportColor, productionColor } from "./styles";
import { withStyles } from "@material-ui/core/styles";
import { httpBaseUrl, wsBaseUrl } from "../../../config";
import Ledger from "@daml/ledger";
import { UserState } from "../../../Redux/State/UserState";
import { Record } from "@daml.js/app-0.0.1/lib/Record";
import Eco from "@material-ui/icons/Eco";
import { ProductionRecordResult } from "./ProductionRecordResult";
import { ProcessingStartResult } from "./ProcessingStartResult";
import { TransportationStartResult } from "./TransportationStartResult";
import { TransportationEndResult } from "./TransportationEndResult";
import { ProcessingEndResult } from "./ProcessingEndResult";
import { HandoverRecordResult } from "./HandoverRecordResult";
import { recordToProductionRecord, ProductionRecord } from "../../../Types/ProductionRecord";
import { recordToProcessingRecord, ProcessingRecord } from "../../../Types/ProcessingRecord";
import { recordToTransportationRecord, TransportationRecord } from "../../../Types/TransportationRecord";
import { recordToHandoverRecord, HandoverRecord } from "../../../Types/HandoverRecord";
import { RecordDetailsTag } from "../../../Types/Record";
import green from '@material-ui/core/colors/green';
import brown from '@material-ui/core/colors/brown';
import lightBlue from '@material-ui/core/colors/lightBlue';
import LocalShipping from "@material-ui/icons/LocalShipping";
import People from "@material-ui/icons/People";
import Autorenew from "@material-ui/icons/Autorenew";
import { uiSplitDate } from "../../../Utils/DateFormat"
import { Product } from "@daml.js/app-0.0.1/lib/Product";

const TimelineOppositeContent = withStyles({
  root: {
    width: "140px",
    flex: 0,
    textAlign: "right"
  }
})(MuiTimelineOppositeContent);

const TimelineItem = withStyles({
  missingOppositeContent: {
    "&:before": {
      display: "none"
    }
  }
})(MuiTimelineItem);

const Timeline = withStyles({
  root: {
    padding: "0px 0px",
    margin: "0px 0px"
  }
})(MuiTimeline);

interface ProductTimelineComponentOwnProps {
  product: Product;
  user: UserState;
}

interface ProductTimelineState {
  records: Record[];
}

type ProductTimelineComponentProps = ProductTimelineComponentOwnProps & StyleProps;

class ProductTimelineComponent extends React.Component<ProductTimelineComponentProps, ProductTimelineState> {
  constructor(props: ProductTimelineComponentProps) {
    super(props);
    this.state = { records: [] };
  }
  
  async componentDidMount() {
    this.fetchData();
  }

  async componentDidUpdate(nextProps: ProductTimelineComponentProps) {
    const { product } = this.props;
    if (product.productId === nextProps.product.productId) {
      if (product.version === nextProps.product.version) return;
    }
    this.fetchData();
  }

  sortRecords(records: Record[]) {
    records.sort((a, b) => new Date(a.completionTime).getTime() - new Date(b.completionTime).getTime());
  }

  async fetchData() {
    const { user, product } = this.props;
    if (!user.loggedIn) return;
    const ledger = new Ledger({ token: user.token, httpBaseUrl, wsBaseUrl });
    const results = await ledger.query(Record, { productId: product.productId });
    const records = results.map(result => result.payload);
    this.sortRecords(records);
    this.setState({ records });
  }

  renderTime(time: string) {
    const dateAndTime = uiSplitDate(time);
    return (
      <React.Fragment>
        <Typography variant="body2" color="textSecondary">
          {dateAndTime[0]}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {dateAndTime[1]}
        </Typography>
      </React.Fragment>
    );
  }

  renderProductionRecord(record: ProductionRecord, i: number, isLast: boolean, nextAlsoProduction: boolean) {
    const { classes } = this.props;
    return (
      <TimelineItem>
        <TimelineOppositeContent>
          {this.renderTime(record.time)}
        </TimelineOppositeContent>
        <TimelineSeparator>
          <div style={{ color: productionColor }}>
            <TimelineDot color="inherit">
              <Eco />
            </TimelineDot>
          </div>
          {isLast 
            ? null 
            : nextAlsoProduction 
              ? <TimelineConnector className={classes.productionConnector}/>
              : <TimelineConnector />
          }
        </TimelineSeparator>
        <TimelineContent>
          <Paper elevation={3} className={classes.paper}>
            <ProductionRecordResult record={record}/>
          </Paper>
        </TimelineContent>
      </TimelineItem>
    );
  }

  renderProcessingRecord(record: ProcessingRecord, i: number, isLast: boolean) {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <TimelineItem key={i}>
          <TimelineOppositeContent>
            {this.renderTime(record.startTime)}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <div style={{ color: processColor }}>
              <TimelineDot color="inherit">
                <Autorenew />
              </TimelineDot>
            </div>
            <TimelineConnector className={classes.processConnector}/>
          </TimelineSeparator>
          <TimelineContent>
            <Paper elevation={3} className={classes.paper}>
              <ProcessingStartResult record={record}/>
            </Paper>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem key={i+0.1}>
          <TimelineOppositeContent>
            {this.renderTime(record.endTime)}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <div style={{ color: processColor }}>
              <TimelineDot color="inherit">
                <Autorenew />
              </TimelineDot>
            </div>
            {isLast ? null : <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <Paper elevation={3} className={classes.paper}>
              <ProcessingEndResult record={record}/>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      </React.Fragment>
    );
  }

  renderTransportationRecord(record: TransportationRecord, i: number, isLast: boolean) {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <TimelineItem key={i}>
          <TimelineOppositeContent>
            {this.renderTime(record.startTime)}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <div style={{ color: transportColor }}>
              <TimelineDot color="inherit">
                <LocalShipping />
              </TimelineDot>
            </div>
            <TimelineConnector className={classes.transportConnector}/>
          </TimelineSeparator>
          <TimelineContent>
            <Paper elevation={3} className={classes.paper}>
              <TransportationStartResult record={record}/>
            </Paper>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem key={i+0.5}>
        <TimelineOppositeContent>
          {this.renderTime(record.endTime)}
        </TimelineOppositeContent>
        <TimelineSeparator>
          <div style={{ color: transportColor }}>
            <TimelineDot color="inherit">
              <LocalShipping />
            </TimelineDot>
          </div>
          {isLast ? null : <TimelineConnector />}
        </TimelineSeparator>
        <TimelineContent>
          <Paper elevation={3} className={classes.paper}>
            <TransportationEndResult record={record}/>
          </Paper>
        </TimelineContent>
      </TimelineItem>
    </React.Fragment>
    );
  }

  renderHandoverRecord(record: HandoverRecord, i: number, isLast: boolean) {
    const { classes } = this.props;
    return (
      <TimelineItem key={i}>
        <TimelineOppositeContent>
          {this.renderTime(record.time)}
        </TimelineOppositeContent>
        <TimelineSeparator>
          <div style={{ color: lightBlue[500] }}>
            <TimelineDot color="inherit">
              <People />
            </TimelineDot>
          </div>
          {isLast ? null : <TimelineConnector />}
        </TimelineSeparator>
        <TimelineContent>
          <Paper elevation={3} className={classes.paper}>
            <HandoverRecordResult record={record}/>
          </Paper>
        </TimelineContent>
      </TimelineItem>
    );
  }

  renderRecord(i: number) {
    const record = this.state.records[i];
    const isLast = i === this.state.records.length-1;
    switch (record.details.tag) {
      case RecordDetailsTag.PRODUCTION:
        const nextAlsoProduction = !isLast && this.state.records[i+1].details.tag === RecordDetailsTag.PRODUCTION;
        const productionRecord = recordToProductionRecord(record);
        return !!productionRecord ? this.renderProductionRecord(productionRecord, i, isLast, nextAlsoProduction) : null;
      case RecordDetailsTag.PROCESSING:
        const processingRecord = recordToProcessingRecord(record);
        return !!processingRecord ? this.renderProcessingRecord(processingRecord, i, isLast) : null;
      case RecordDetailsTag.TRANSPORTATION:
        const transportationRecord = recordToTransportationRecord(record);
        return !!transportationRecord ? this.renderTransportationRecord(transportationRecord, i, isLast) : null;
      case RecordDetailsTag.HANDOVER:
        const handoverRecord = recordToHandoverRecord(record);
        return !!handoverRecord ? this.renderHandoverRecord(handoverRecord, i, isLast) : null;
      default:
        return null;
    }
  }

  nextType(i: number) {

  }

  render() {
    const { records } = this.state;
    return (
      <Timeline>
        {records.map((record, i) => this.renderRecord(i))}
      </Timeline>
    );
  }
}

export const ProductTimeline = withStyles(styles, { withTheme: true })(ProductTimelineComponent);
