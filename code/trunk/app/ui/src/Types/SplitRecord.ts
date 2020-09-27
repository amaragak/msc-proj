import { Record, SplitRecordDetails } from "@daml.js/app-0.0.1/lib/Record";
import { RecordDetailsTag, RecordForEdit } from "./Record";

export function recordToSplitRecord(record: Record): SplitRecord | undefined {
  if (record.details.tag !== RecordDetailsTag.SPLIT) return undefined;
  return {
    ...record,
    ...record.details.value
  }
}

export type SplitRecord = RecordForEdit & SplitRecordDetails;
