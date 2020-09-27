import { Record } from "@daml.js/app-0.0.1/lib/Record";

export type RecordTemplate = typeof Record;

export const RecordDetailsTag = {
  PRODUCTION: "ProductionRecordDetailsTag" as "ProductionRecordDetailsTag",
  PROCESSING: "ProcessingRecordDetailsTag" as "ProcessingRecordDetailsTag",
  PROCESSING_START: "ProcessingStartRecordDetailsTag" as "ProcessingStartRecordDetailsTag",
  PROCESSING_END: "ProcessingEndRecordDetailsTag" as "ProcessingEndRecordDetailsTag",
  TRANSPORTATION: "TransportationRecordDetailsTag" as "TransportationRecordDetailsTag",
  TRANSPORTATION_START: "TransportationStartRecordDetailsTag" as "TransportationStartRecordDetailsTag",
  TRANSPORTATION_END: "TransportationEndRecordDetailsTag" as "TransportationEndRecordDetailsTag",
  STORAGE: "StorageRecordDetailsTag" as "StorageRecordDetailsTag",
  HANDOVER: "HandoverRecordDetailsTag" as "HandoverRecordDetailsTag",
  SALE: "SaleRecordDetailsTag" as "SaleRecordDetailsTag",
  MERGE: "MergeRecordDetailsTag" as "MergeRecordDetailsTag",
  SPLIT: "SplitRecordDetailsTag" as "SplitRecordDetailsTag"
}

export type RecordForEdit = Omit<Record, "details"|"completionTime"|"recordType">;
