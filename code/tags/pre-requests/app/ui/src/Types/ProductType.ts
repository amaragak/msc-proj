export enum Unit {
  UNDEFINED,
  KG,
  LITRES
}

export function unitToString(unit: Unit): string {
  return Unit[unit].toLowerCase();
}

export function unitFromString(unitStr: string | null): Unit {
  if (unitStr === null) return Unit.UNDEFINED;
  return (Unit as any)[unitStr.toUpperCase()];
}

export interface ProductType {
  identifier: string;
  name: string;
  unit: Unit
};

function typeCompare(type1: ProductType, type2: ProductType) {
  return type1.name.localeCompare(type2.name);
}

export const RawProductTypes: ProductType[] = [
  { identifier: "ginger", name: "Ginger", unit: Unit.KG },
  { identifier: "bananas", name: "Bananas", unit: Unit.KG },
  { identifier: "coffee_beans", name: "Coffee Beans", unit: Unit.KG },
  { identifier: "oranges", name: "Oranges", unit: Unit.KG },
  { identifier: "sugar_cane", name: "Sugar Cane", unit: Unit.KG }
].sort(typeCompare);

export const ProcessedProductTypes: ProductType[] = [
  { identifier: "dried_ginger", name: "Dried Ginger", unit: Unit.KG },
  { identifier: "sliced_bananas", name: "Sliced Bananas", unit: Unit.KG },
  { identifier: "roasted_coffee_beans", name: "Roasted Coffee Beans", unit: Unit.KG },
  { identifier: "orange_juice", name: "Orange Juice", unit: Unit.LITRES },
  { identifier: "sugar", name: "Sugar", unit: Unit.KG }
].sort(typeCompare);

const undefinedProductType: ProductType = {
  identifier: "",
  name: "",
  unit: Unit.UNDEFINED
};

export const ProductTypes: ProductType[] = RawProductTypes.concat(ProcessedProductTypes).sort(typeCompare);;

export function rawProductTypeFromId(typeId: string): ProductType {
  const result = RawProductTypes.find((productType) => productType.identifier === typeId);
  if (result === undefined) return undefinedProductType;
  return result;
}

export function processedProductTypeFromId(typeId: string): ProductType {
  const result = ProcessedProductTypes.find((productType) => productType.identifier === typeId);
  if (result === undefined) return undefinedProductType;
  return result;
}

export function productTypeFromId(typeId: string): ProductType {
  const result = ProductTypes.find((productType) => productType.identifier === typeId);
  if (result === undefined) return undefinedProductType;
  return result;
}

