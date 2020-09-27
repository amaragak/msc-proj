import { Record, MergeRecordDetails } from "@daml.js/app-0.0.1/lib/Record";
import { RecordDetailsTag, RecordForEdit } from "./Record";

export function recordToMergeRecord(record: Record): MergeRecord | undefined {
  if (record.details.tag !== RecordDetailsTag.MERGE) return undefined;
  return {
    ...record,
    ...record.details.value
  }
}

export type MergeRecord = RecordForEdit & MergeRecordDetails;
