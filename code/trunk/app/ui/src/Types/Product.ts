import { Product, ProductState } from "@daml.js/app-0.0.1/lib/Product";
import { RecordType } from "@daml.js/app-0.0.1/lib/Record";
import { truthyFields } from "../Utils/TruthyFields";
import { generateGuid } from "../Utils/GenerateGuid";
import { startOfTime, ledgerDate } from "../Utils/DateFormat";
import { UserState } from "../Redux/State/UserState";
import { emptyProductInfo } from "./ProductInfo";

export function productStateToString(product: Product, includeOrderParty: boolean): string {
  switch (product.state) {
    case ProductState.IDLE: return "-"
    case ProductState.HANDOVER_REQUESTED: 
      return "Handover requested" + ((includeOrderParty) ? requestPartyString(product.requestObserver) : "");
    case ProductState.SALE_REQUESTED: 
      return "Sale requested" + ((includeOrderParty) ? requestPartyString(product.offerObserver) : "");
    case ProductState.IN_PROCESS: 
      return "Processing" + ((includeOrderParty) ? requestPartyString(product.handler) : "");
    case ProductState.IN_TRANSIT: 
      return "In transit" + ((includeOrderParty) ? requestPartyString(product.handler) : "");
    case ProductState.PROCESSING_ACCEPTED: 
      return "Awaiting processing" + ((includeOrderParty) ? requestPartyString(product.handler) : "");
    case ProductState.PROCESSING_REQUESTED:  
      return "Processing requested" + ((includeOrderParty) ? requestPartyString(product.requestObserver) : "");
    case ProductState.TRANSPORTATION_ACCEPTED: 
      return "Awaiting transportation" + ((includeOrderParty) ? requestPartyString(product.handler) : "");
    case ProductState.TRANSPORTATION_REQUESTED: 
      return "Transportation requested" + ((includeOrderParty) ? requestPartyString(product.requestObserver) : "");
    default: return ""
  }
}

function requestPartyString(partyUser: string | null): string {
  if (!partyUser) return "";
  return " (" + partyUser + ")";
}

export const ProductOrderCidTag = {
  PROCESSING_REQUEST: "ProcessingRequestCidTag" as "ProcessingRequestCidTag",
  PROCESSING_NEW: "NewProcessingOrderCidTag" as "NewProcessingOrderCidTag",
  PROCESSING_ACTIVE: "ActiveProcessingOrderCidTag" as "ActiveProcessingOrderCidTag",
  TRANSPORTATION_REQUEST: "TransportationRequestCidTag" as "TransportationRequestCidTag",
  TRANSPORTATION_NEW: "NewTransportationOrderCidTag" as "NewTransportationOrderCidTag",
  TRANSPORTATION_ACTIVE: "ActiveTransportationOrderCidTag" as "ActiveTransportationOrderCidTag",
  HANDOVER_REQUEST: "HandoverRequestCidTag" as "HandoverRequestCidTag",
  SALE_REQUEST: "SaleRequestCidTag" as "SaleRequestCidTag"
}

export function emptyProduct(user: UserState): Product {
  const owner = user.loggedIn ? user.username : "";
  return {
    orderCid: null,
    offerObserver: null,
    requestObserver: null,
    version: "1",
    productId: generateGuid(),
    lastUpdated: startOfTime(),
    isProcessed: false,
    description: "",
    owner,
    handler: owner,
    productInfo: emptyProductInfo,
    recordKeys: [],
    lastRecordType: RecordType.UNDEFINED,
    state: ProductState.IDLE
  }
};

export function prepareProductForLedger(product: Product): Product {
  return {
    ...product,
    lastUpdated: ledgerDate(product.lastUpdated)
  }
}

export function getProductKey(product: Product): ProductKey {
  return {
    _1: product.owner,
    _2: product.productId
  };
}

export interface ProductKey {
  _1: string;
  _2: string;
}

export type ProductTemplate = typeof Product;

export function validateNewProduct(product: Product) {
  const { owner, handler, productInfo, description } = product;
  return truthyFields({ owner, handler, typeId: productInfo.typeId, description });
}
