import { Record, ProcessingRecordDetails, RecordType, ProcessingStartRecordDetails, ProcessingEndRecordDetails } from "@daml.js/app-0.0.1/lib/Record";
import { truthyFields } from "../Utils/TruthyFields";
import { generateGuid } from "../Utils/GenerateGuid";
import { endAfterStart } from "../Utils/EndAfterStart";
import { ledgerDate, newEditDate } from "../Utils/DateFormat";
import { RecordDetailsTag, RecordForEdit } from "./Record";
import { Product } from "@daml.js/app-0.0.1/lib/Product";
import { UserState } from "../Redux/State/UserState";
import { emptyLocation } from "./Location";
import { validateNumericString } from "../Utils/ValidateNumericString";

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

export function recordToProcessingStartRecord(record: Record): ProcessingStartRecord | undefined {
  if (record.details.tag !== RecordDetailsTag.PROCESSING_START) return undefined;
  return {
    ...record,
    ...record.details.value
  }
}

export function recordToProcessingEndRecord(record: Record): ProcessingEndRecord | undefined {
  if (record.details.tag !== RecordDetailsTag.PROCESSING_END) return undefined;
  return {
    ...record,
    ...record.details.value
  }
}

export function emptyProcessingRecord(product: Product, user: UserState): ProcessingRecord {
  const now = newEditDate();
  const location = user.loggedIn && !!user.location ? user.location : emptyLocation;
  return {
    offerObserver: null,
    requestObserver: null,
    productId: product.productId,
    recordId: generateGuid(),
    actor: product.handler,
    productOwner: product.owner,
    productCurrentHandler: product.handler,
    inputProduct: product.productInfo,
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
    location
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
export type ProcessingStartRecord = RecordForEdit & ProcessingStartRecordDetails;
export type ProcessingEndRecord = RecordForEdit & ProcessingEndRecordDetails;

export function validateProcessingRecord(record: ProcessingRecord, product: Product) {
  if (!truthyFields(record)) return false;
  if (!validateNumericString(record.outputProduct.amount.quantity)) return false;
  const startTime = record.startTime;
  const endTime = record.endTime;
  return endAfterStart({ startTime, endTime }) && endAfterStart({ startTime: product.lastUpdated, endTime: record.startTime });
}

