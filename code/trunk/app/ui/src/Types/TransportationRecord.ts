import { Record, RecordType, TransportationRecordDetails, TransportationStartRecordDetails, TransportationEndRecordDetails } from "@daml.js/app-0.0.1/lib/Record";
import { Product } from "@daml.js/app-0.0.1/lib/Product";
import { RecordDetailsTag, RecordForEdit } from "./Record";
import { truthyFields } from "../Utils/TruthyFields";
import { generateGuid } from "../Utils/GenerateGuid";
import { endAfterStart } from "../Utils/EndAfterStart";
import { ledgerDate, newEditDate } from "../Utils/DateFormat";

export function transportationRecordToRecord(record: TransportationRecord): Record {
  return {
    ...record,
    completionTime: record.endTime,
    recordType: RecordType.TRANSPORTATION,
    details: {
      tag: RecordDetailsTag.TRANSPORTATION,
      value: {
        ...record,
        startTime: ledgerDate(record.startTime),
        endTime: ledgerDate(record.endTime)
      }
    }
  }
}

export function recordToTransportationRecord(record: Record): TransportationRecord | undefined {
  if (record.details.tag !== RecordDetailsTag.TRANSPORTATION) return undefined;
  return {
    ...record,
    ...record.details.value
  }
}

export function recordToTransportationStartRecord(record: Record): TransportationStartRecord | undefined {
  if (record.details.tag !== RecordDetailsTag.TRANSPORTATION_START) return undefined;
  return {
    ...record,
    ...record.details.value
  }
}

export function recordToTransportationEndRecord(record: Record): TransportationEndRecord | undefined {
  if (record.details.tag !== RecordDetailsTag.TRANSPORTATION_END) return undefined;
  return {
    ...record,
    ...record.details.value
  }
}

export function emptyTransportationRecord(product: Product): TransportationRecord {
  const now = newEditDate();
  return {
    offerObserver: null,
    requestObserver: null,
    productId: product.productId,
    recordId: generateGuid(),
    actor: product.handler,
    productOwner: product.owner,
    productCurrentHandler: product.handler,
    product: product.productInfo,
    startLocation: {
      name: "",
      country: ""
    },
    startTime: now,
    endLocation: {
      name: "",
      country: ""
    },
    endTime: now
  };
}

export interface AddTransportationRecordChoiceArgs {
  recordId: string;
  recordTransporter: string;
  recordStartTime: string;
  recordEndTime: string;
  recordStartLocation: {
    name: string,
    country: string
  },
  recordEndLocation: {
    name: string,
    country: string
  },
}

export function transportationRecordToChoiceArgs(record: TransportationRecord) {
  return {
    recordId: record.recordId,
    recordTransporter: record.actor,
    recordStartTime: ledgerDate(record.startTime),
    recordEndTime: ledgerDate(record.endTime),
    recordStartLocation: record.startLocation,
    recordEndLocation: record.endLocation
  };
}

export type TransportationRecord = RecordForEdit & TransportationRecordDetails;
export type TransportationStartRecord = RecordForEdit & TransportationStartRecordDetails;
export type TransportationEndRecord = RecordForEdit & TransportationEndRecordDetails;

export function validateTransportationRecord(record: TransportationRecord, product: Product) {
  if (!truthyFields(record)) return false;
  const startTime = record.startTime;
  const endTime = record.endTime;
  return endAfterStart({ startTime, endTime }) && endAfterStart({ startTime: product.lastUpdated, endTime: record.startTime });
}
