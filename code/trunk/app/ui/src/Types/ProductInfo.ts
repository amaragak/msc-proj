import { ProductInfo } from "@daml.js/app-0.0.1/lib/Types";
import { emptyAmount } from "./Amount";

export const emptyProductInfo: ProductInfo = {
  amount: emptyAmount,
  typeId: "",
  labels: []
};
