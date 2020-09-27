import { Record, ProcessingRecordDetails, RecordType } from "@daml.js/app-0.0.1/lib/Record";
import { truthyFields } from "../Utils/TruthyFields";
import { generateGuid } from "../Utils/GenerateGuid";
import { endAfterStart } from "../Utils/EndAfterStart";
import { ledgerDate, newEditDate } from "../Utils/DateFormat";
import { RecordDetailsTag, RecordForEdit } from "./Record";
import { Product } from "@daml.js/app-0.0.1/lib/Product";

export function processingRecordToRecord(record: ProcessingRecord): Record {
  return {
    ...record,
    completionTime: record.endTime,
    recordType: RecordType.PROCESSING,
    details: {
      tag: RecordDetailsTag.PROCESSING,
      value: {
        ...record,
        startTime: ledgerDate(record.startTime),
        endTime: ledgerDate(record.endTime)
      }
    }
  }
}

export function recordToProcessingRecord(record: Record): ProcessingRecord | undefined {
  if (record.details.tag !== RecordDetailsTag.PROCESSING) return undefined;
  return {
    ...record,
    ...record.details.value
  }
}

export function emptyProcessingRecord(product: Product): ProcessingRecord {
  const now = newEditDate();
  return {
    productId: product.productId,
    recordId: generateGuid(),
    actor: product.handler,
    productOwner: product.owner,
    productCurrentHandler: product.handler,
    inputProduct: {
      labels: product.productLabels,
      typeId: product.productType,
      amount: product.amount
    },
    outputProduct: {
      labels: [],
      typeId: "",
      amount: {
        quantity: "",
        unit: ""
      }
    },
    startTime: now,
    endTime: now,
    location: {
      name: "",
      country: ""
    }
  }
};

export interface AddProcessingRecordChoiceArgs {
  recordId: string;
  recordProcessor: string;
  recordStartTime: string;
  recordEndTime: string;
  recordLocation: {
    name: string,
    country: string
  },
  recordOutputAmount: string;
  recordOutputType: string;
  recordOutputLabel: string;
}

export function processingRecordToChoiceArgs(record: ProcessingRecord) {
  return {
    recordId: record.recordId,
    recordProcessor: record.actor,
    recordStartTime: ledgerDate(record.startTime),
    recordEndTime: ledgerDate(record.endTime),
    recordLocation: record.location,
    recordOutputAmount: record.outputProduct.amount,
    recordOutputType: record.outputProduct.typeId,
    recordOutputLabel: record.outputProduct.labels[0]
  }
}

export type ProcessingRecord = RecordForEdit & ProcessingRecordDetails;

export function validateProcessingRecord(record: ProcessingRecord) {
  if (!truthyFields(record)) return false;
  const startTime = record.startTime;
  const endTime = record.endTime;
  return endAfterStart({ startTime, endTime })
}

