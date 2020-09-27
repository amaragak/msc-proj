import { Product } from "@daml.js/app-0.0.1/lib/Product";
import { RecordType } from "@daml.js/app-0.0.1/lib/Record";
import { truthyFields } from "../Utils/TruthyFields";
import { generateGuid } from "../Utils/GenerateGuid";
import { startOfTime, ledgerDate } from "../Utils/DateFormat";
import { UserState } from "../Redux/State/UserState";

export function emptyProduct(user: UserState): Product {
  const owner = user.loggedIn ? user.username : "";
  return {
    version: "1",
    productId: generateGuid(),
    lastUpdated: startOfTime(),
    isProcessed: false,
    description: "",
    owner,
    handler: owner,
    productLabels: [],
    productType: "",
    amount: {
      quantity: "" + 0,
      unit: ""
    },
    recordKeys: [],
    lastRecordType: RecordType.UNDEFINED
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
  const { owner, handler, productType, description } = product;
  return truthyFields({ owner, handler, productType, description });
}
