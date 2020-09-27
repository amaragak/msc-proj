import { consoleDebug } from "./ConsoleDebug";

const ignoreFields: string[] = ["requestObserver", "offerObserver", "orderCid", "validationError"];

export function truthyFields(contract: any): boolean {
  consoleDebug(contract);
  const keys = Object.keys(contract);
  for (var i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (ignoreFields.some(field => field === key)) continue;
    const value = Reflect.get(contract, key);
    if (!value) {
      consoleDebug("[BAD] key: " + key + ", value: " + value);
      return false;
    } else {
      consoleDebug("key: " + key + ", value: " + value);
      if (value instanceof Object) return truthyFields(value);
    }
  }
  return true;
}
