import { Record, RecordType, ProductionRecordDetails } from "@daml.js/app-0.0.1/lib/Record";
import { Product } from "@daml.js/app-0.0.1/lib/Product";
import { truthyFields } from "../Utils/TruthyFields";
import { generateGuid } from "../Utils/GenerateGuid";
import { RecordDetailsTag, RecordForEdit } from "./Record";
import { ledgerDate, newEditDate } from "../Utils/DateFormat";

export function productionRecordToRecord(record: ProductionRecord): Record {
  return {
    ...record,
    completionTime: record.time,
    recordType: RecordType.PRODUCTION,
    details: {
      tag: RecordDetailsTag.PRODUCTION,
      value: {
        ...record,
        time: ledgerDate(record.time)
      }
    }
  }
}

export function recordToProductionRecord(record: Record): ProductionRecord | undefined {
  if (record.details.tag !== RecordDetailsTag.PRODUCTION) return undefined;
  return {
    ...record,
    ...record.details.value
  }
}

export function emptyProductionRecord(product: Product): ProductionRecord {
  const now = newEditDate();
  return {
    productId: product.productId,
    recordId: generateGuid(),
    actor: product.handler,
    productOwner: product.owner,
    productCurrentHandler: product.handler,
    time: now,
    plotId: "",
    product: {
      labels: [],
      typeId: product.productType,
      amount: {
        quantity: "",
        unit: ""
      }
    },
    location: {
      name: "",
      country: ""
    }
  };
}

export interface AddProductionRecordChoiceArgs {
  recordId: string;
  recordProducer: string;
  recordTime: string;
  recordLocation: {
    name: string;
    country: string;
  };
  recordAmount: {
    quantity: string;
    unit: string;
  };
  recordPlotId: string;
  recordLabel: string;
}

export function productionRecordToChoiceArgs(record: ProductionRecord) {
  return { 
    recordId: record.recordId,
    recordProducer: record.actor,
    recordTime: ledgerDate(record.time),
    recordLocation: record.location,
    recordAmount: record.product.amount,
    recordPlotId: record.plotId,
    recordLabel: record.product.labels[0]
  }
}

export type ProductionRecord = RecordForEdit & ProductionRecordDetails;

export function validateProductionRecord(record: ProductionRecord) {
  return truthyFields(record);
}
