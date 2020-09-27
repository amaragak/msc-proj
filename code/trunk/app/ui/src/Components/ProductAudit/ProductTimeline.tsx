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
import { styles, StyleProps, processColor, transportColor, productionColor, mergeColor } from "./styles";
import { withStyles } from "@material-ui/core/styles";
import { httpBaseUrl, wsBaseUrl } from "../../config";
import Ledger from "@daml/ledger";
import { UserState } from "../../Redux/State/UserState";
import { Record } from "@daml.js/app-0.0.1/lib/Record";
import Eco from "@material-ui/icons/Eco";
import { ProductionRecordResult } from "./ProductionRecordResult";
import { ProcessingStartResult } from "./ProcessingStartResult";
import { TransportationStartResult } from "./TransportationStartResult";
import { TransportationEndResult } from "./TransportationEndResult";
import { ProcessingEndResult } from "./ProcessingEndResult";
import { HandoverRecordResult } from "./HandoverRecordResult";
import { MergeRecordResult } from "./MergeRecordResult";
import { SplitRecordResult } from "./SplitRecordResult";
import { SaleRecordResult } from "./SaleRecordResult";
import { recordToProductionRecord, ProductionRecord } from "../../Types/ProductionRecord";
import { ProcessingEndRecord, recordToProcessingEndRecord } from "../../Types/ProcessingRecord";
import { ProcessingStartRecord, recordToProcessingStartRecord } from "../../Types/ProcessingRecord";
import { recordToTransportationStartRecord, TransportationStartRecord } from "../../Types/TransportationRecord";
import { recordToTransportationEndRecord, TransportationEndRecord } from "../../Types/TransportationRecord";
import { recordToHandoverRecord, HandoverRecord } from "../../Types/HandoverRecord";
import { recordToMergeRecord, MergeRecord } from "../../Types/MergeRecord";
import { recordToSplitRecord, SplitRecord } from "../../Types/SplitRecord";
import { recordToSaleRecord, SaleRecord } from "../../Types/SaleRecord";
import { RecordDetailsTag } from "../../Types/Record";
import lightBlue from '@material-ui/core/colors/lightBlue';
import red from '@material-ui/core/colors/red';
import LocalShipping from "@material-ui/icons/LocalShipping";
import AttachMoney from "@material-ui/icons/AttachMoney";
import CallMerge from "@material-ui/icons/CallMerge";
import CallSplit from "@material-ui/icons/CallSplit";
import People from "@material-ui/icons/People";
import Autorenew from "@material-ui/icons/Autorenew";
import { uiSplitDate } from "../../Utils/DateFormat"
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

  private mounted: boolean = false;
  
  componentDidMount() {
    this.mounted = true;
    this.fetchData();
  }

  componentDidUpdate(nextProps: ProductTimelineComponentProps) {
    const { product } = this.props;
    if (product.productId === nextProps.product.productId) {
      if (product.version === nextProps.product.version) return;
    }
    this.fetchData();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  sortRecords(records: Record[]) {
    records.sort((a, b) => new Date(a.completionTime).getTime() - new Date(b.completionTime).getTime());
  }

  fetchData() {
    const { user, product } = this.props;
    if (!user.loggedIn) return;
    const ledger = new Ledger({ token: user.token, httpBaseUrl, wsBaseUrl });
    ledger.query(Record, { productId: product.productId })
      .then(results => {
        const records = results.map(result => result.payload);
        this.sortRecords(records);
        this.mounted && this.setState({ records });
      });
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
      <TimelineItem key={i}>
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

  renderMergeRecord(record: MergeRecord, i: number, isLast: boolean, nextAlsoMerge: boolean) {
    const { classes } = this.props;
    return (
      <TimelineItem key={i}>
        <TimelineOppositeContent>
          {this.renderTime(record.time)}
        </TimelineOppositeContent>
        <TimelineSeparator>
          <div style={{ color: mergeColor }}>
            <TimelineDot color="inherit">
              <CallMerge />
            </TimelineDot>
          </div>
          {isLast 
            ? null 
            : nextAlsoMerge
              ? <TimelineConnector className={classes.mergeConnector}/>
              : <TimelineConnector />
          }
        </TimelineSeparator>
        <TimelineContent>
          <Paper elevation={3} className={classes.paper}>
            <MergeRecordResult record={record}/>
          </Paper>
        </TimelineContent>
      </TimelineItem>
    );
  }

  renderSplitRecord(record: SplitRecord, i: number, isLast: boolean, nextAlsoSplit: boolean) {
    const { classes } = this.props;
    return (
      <TimelineItem key={i}>
        <TimelineOppositeContent>
          {this.renderTime(record.time)}
        </TimelineOppositeContent>
        <TimelineSeparator>
          <div style={{ color: mergeColor }}>
            <TimelineDot color="inherit">
              <CallSplit />
            </TimelineDot>
          </div>
          {isLast 
            ? null 
            : nextAlsoSplit 
              ? <TimelineConnector className={classes.mergeConnector}/>
              : <TimelineConnector />
          }
        </TimelineSeparator>
        <TimelineContent>
          <Paper elevation={3} className={classes.paper}>
            <SplitRecordResult record={record}/>
          </Paper>
        </TimelineContent>
      </TimelineItem>
    );
  }

  renderProcessingStartRecord(record: ProcessingStartRecord, i: number, isLast: boolean, nextIsEnd: boolean) {
    const { classes } = this.props;
    return (
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
          {isLast 
            ? null
            : nextIsEnd
              ? <TimelineConnector className={classes.processConnector}/>
              : <TimelineConnector/>
          }
        </TimelineSeparator>
        <TimelineContent>
          <Paper elevation={3} className={classes.paper}>
            <ProcessingStartResult record={record}/>
          </Paper>
        </TimelineContent>
      </TimelineItem>
    );
  }

  renderProcessingEndRecord(record: ProcessingEndRecord, i: number, isLast: boolean) {
    const { classes } = this.props;
    return (
      <TimelineItem key={i}>
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
    );
  }

  renderTransportationStartRecord(record: TransportationStartRecord, i: number, isLast: boolean, nextIsEnd: boolean) {
    const { classes } = this.props;
    return (
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
          {isLast 
            ? null 
            : nextIsEnd 
              ? <TimelineConnector className={classes.transportConnector}/>
              : <TimelineConnector />
          }
        </TimelineSeparator>
        <TimelineContent>
          <Paper elevation={3} className={classes.paper}>
            <TransportationStartResult record={record}/>
          </Paper>
        </TimelineContent>
      </TimelineItem>
    );
  }

  renderTransportationEndRecord(record: TransportationEndRecord, i: number, isLast: boolean) {
    const { classes } = this.props;
    return (
      <TimelineItem key={i}>
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

  renderSaleRecord(record: SaleRecord, i: number, isLast: boolean) {
    const { classes } = this.props;
    return (
      <TimelineItem key={i}>
        <TimelineOppositeContent>
          {this.renderTime(record.time)}
        </TimelineOppositeContent>
        <TimelineSeparator>
          <div style={{ color: red[500] }}>
            <TimelineDot color="inherit">
              <AttachMoney />
            </TimelineDot>
          </div>
          {isLast ? null : <TimelineConnector />}
        </TimelineSeparator>
        <TimelineContent>
          <Paper elevation={3} className={classes.paper}>
            <SaleRecordResult record={record}/>
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
      case RecordDetailsTag.PROCESSING_START:
        const processingStartRecord = recordToProcessingStartRecord(record);
        const nextIsProcessEnd = !isLast && recordToProcessingEndRecord(this.state.records[i+1])?.processId === processingStartRecord?.processId;
        return !!processingStartRecord ? this.renderProcessingStartRecord(processingStartRecord, i, isLast, nextIsProcessEnd) : null;
      case RecordDetailsTag.PROCESSING_END:
        const processingEndRecord = recordToProcessingEndRecord(record);
        return !!processingEndRecord ? this.renderProcessingEndRecord(processingEndRecord, i, isLast) : null;
      case RecordDetailsTag.TRANSPORTATION_START:
        const transportationStartRecord = recordToTransportationStartRecord(record);
        const nextIsTransportEnd = !isLast && recordToTransportationEndRecord(this.state.records[i+1])?.transportId === transportationStartRecord?.transportId;
        return !!transportationStartRecord ? this.renderTransportationStartRecord(transportationStartRecord, i, isLast, nextIsTransportEnd) : null;
      case RecordDetailsTag.TRANSPORTATION_END:
        const transportationEndRecord = recordToTransportationEndRecord(record);
        return !!transportationEndRecord ? this.renderTransportationEndRecord(transportationEndRecord, i, isLast) : null;
      case RecordDetailsTag.HANDOVER:
        const handoverRecord = recordToHandoverRecord(record);
        return !!handoverRecord ? this.renderHandoverRecord(handoverRecord, i, isLast) : null;
      case RecordDetailsTag.SALE:
        const saleRecord = recordToSaleRecord(record);
        return !!saleRecord ? this.renderSaleRecord(saleRecord, i, isLast) : null;
      case RecordDetailsTag.MERGE:
        const nextAlsoMerge = !isLast && this.state.records[i+1].details.tag === RecordDetailsTag.MERGE;
        const mergeRecord = recordToMergeRecord(record);
        return !!mergeRecord ? this.renderMergeRecord(mergeRecord, i, isLast, nextAlsoMerge) : null;
      case RecordDetailsTag.SPLIT:
        const nextAlsoSplit = !isLast && this.state.records[i+1].details.tag === RecordDetailsTag.SPLIT;
        const splitRecord = recordToSplitRecord(record);
        return !!splitRecord ? this.renderSplitRecord(splitRecord, i, isLast, nextAlsoSplit) : null;
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
