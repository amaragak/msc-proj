import { Record, SaleRecordDetails } from "@daml.js/app-0.0.1/lib/Record";
import { RecordDetailsTag, RecordForEdit } from "./Record";

export function recordToSaleRecord(record: Record): SaleRecord | undefined {
  if (record.details.tag !== RecordDetailsTag.SALE) return undefined;
  return {
    ...record,
    ...record.details.value
  }
}

export type SaleRecord = RecordForEdit & SaleRecordDetails;
