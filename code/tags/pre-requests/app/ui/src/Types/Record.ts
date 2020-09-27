import { Record } from "@daml.js/app-0.0.1/lib/Record";

export type RecordTemplate = typeof Record;

export const RecordDetailsTag = {
  PRODUCTION: "ProductionRecord" as "ProductionRecord",
  PROCESSING: "ProcessingRecord" as "ProcessingRecord",
  TRANSPORTATION: "TransportationRecord" as "TransportationRecord",
  STORAGE: "StorageRecord" as "StorageRecord",
  HANDOVER: "HandoverRecord" as "HandoverRecord"
}

export type RecordForEdit = Omit<Record, "details"|"completionTime"|"recordType">;
