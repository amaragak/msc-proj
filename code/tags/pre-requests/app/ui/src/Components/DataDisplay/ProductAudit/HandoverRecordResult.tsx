import React from "react";
import { ProductAuditRecord } from "./ProductAuditRecord";
import { HandoverRecord } from "../../../Types/HandoverRecord";
import { uiDate } from "../../../Utils/DateFormat";

interface HandoverRecordResultProps {
  record: HandoverRecord;
}

export class HandoverRecordResult extends React.Component<HandoverRecordResultProps, {}> {
  render() {
    const { record } = this.props;
    return (
      <ProductAuditRecord
        title="Handover"
        rows={[
          {
            field: "Old Handler",
            value: record.actor
          },
          {
            field: "New Handler",
            value: record.newHandler
          },
          {
            field: "Time",
            value: uiDate(record.time)
          }
        ]}
      />
    );
  }
}

