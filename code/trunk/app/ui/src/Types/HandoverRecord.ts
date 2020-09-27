import { Record, HandoverRecordDetails, RecordType } from "@daml.js/app-0.0.1/lib/Record";
import { truthyFields } from "../Utils/TruthyFields";
import { generateGuid } from "../Utils/GenerateGuid";
import { endAfterStart } from "../Utils/EndAfterStart";
import { ledgerDate, newEditDate } from "../Utils/DateFormat";
import { RecordDetailsTag, RecordForEdit } from "./Record";
import { Product } from "@daml.js/app-0.0.1/lib/Product";

export function handoverRecordToRecord(record: HandoverRecord): Record {
  return {
    ...record,
    completionTime: record.time,
    recordType: RecordType.HANDOVER,
    details: {
      tag: RecordDetailsTag.HANDOVER,
      value: {
        ...record,
        time: ledgerDate(record.time)
      }
    }
  }
}

export function recordToHandoverRecord(record: Record): HandoverRecord | undefined {
  if (record.details.tag !== RecordDetailsTag.HANDOVER) return undefined;
  return {
    ...record,
    ...record.details.value
  }
}

export function emptyHandoverRecord(product: Product): HandoverRecord {
  return {
    oldHandler: product.handler,
    productId: product.productId,
    recordId: generateGuid(),
    actor: product.handler,
    productOwner: product.owner,
    newHandler: "",
    time: newEditDate(),
    productCurrentHandler: product.handler,
    requestObserver: null,
    offerObserver: null,
    product: product.productInfo
  }
};

export interface AddHandoverRecordChoiceArgs {
  recordNewHandler: string;
  recordOldHandler: string;
  recordTime: string;
  recordId: string;
}

export function handoverRecordToChoiceArgs(record: HandoverRecord) {
  return { 
    recordNewHandler: record.newHandler, 
    recordOldHandler: record.actor, 
    recordTime: ledgerDate(record.time),
    recordId: record.recordId
  }
}

export type HandoverRecord = RecordForEdit & HandoverRecordDetails;

export function validateHandoverRecord(record: HandoverRecord, product: Product) {
  return endAfterStart({ startTime: product.lastUpdated, endTime: record.time }) && truthyFields(record);
}

