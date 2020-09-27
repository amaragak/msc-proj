import { generate8charHex } from "../Utils/GenerateGuid";

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

export function generateLabelForTypeId(productTypeId: string) {
  return productTypeId + "_" + generate8charHex();
}

const ProductTypeIds = {
  GINGER: "ginger",
  BANANAS: "bananas",
  COFFEE_BEANS: "coffee_beans",
  ORANGES: "oranges",
  SUGAR_CANE: "sugar_cane",
  DRIED_GINGER: "dried_ginger",
  SLICED_BANANAS: "sliced_bananas",
  BANANA_JUICE: "banana_juice",
  ROASTED_COFFEE: "roasted_coffee_beans",
  ORANGE_JUICE: "orange_juice",
  ORANGE_ZEST: "orange_zest",
  SUGAR: "sugar",
  SUGAR_CUBES: "sugar_cubes"
};

const ginger: ProductType = { identifier: ProductTypeIds.GINGER, name: "Ginger", unit: Unit.KG };
const bananas: ProductType = { identifier: ProductTypeIds.BANANAS, name: "Bananas", unit: Unit.KG };
const coffeeBeans: ProductType = { identifier: ProductTypeIds.COFFEE_BEANS, name: "Coffee Beans", unit: Unit.KG };
const oranges: ProductType = { identifier: ProductTypeIds.ORANGES, name: "Oranges", unit: Unit.KG };
const sugarCane: ProductType = { identifier: ProductTypeIds.SUGAR_CANE, name: "Sugar Cane", unit: Unit.KG };

export const RawProductTypes: ProductType[] = [
  ginger,
  bananas,
  coffeeBeans,
  oranges,
  sugarCane
].sort(typeCompare);


const driedGinger: ProductType = { identifier: ProductTypeIds.DRIED_GINGER, name: "Dried Ginger", unit: Unit.KG };
const slicedBananas: ProductType = { identifier: ProductTypeIds.SLICED_BANANAS, name: "Sliced Bananas", unit: Unit.KG };
const bananaJuice: ProductType = { identifier: ProductTypeIds.BANANA_JUICE, name: "Banana Juice", unit: Unit.LITRES };
const roastedCoffee: ProductType = { identifier: ProductTypeIds.ROASTED_COFFEE, name: "Roasted Coffee Beans", unit: Unit.KG };
const orangeJuice: ProductType = { identifier: ProductTypeIds.ORANGE_JUICE, name: "Orange Juice", unit: Unit.LITRES };
const orangeZest: ProductType = { identifier: ProductTypeIds.ORANGE_ZEST, name: "Orange Zest", unit: Unit.KG };
const sugar: ProductType = { identifier: ProductTypeIds.SUGAR, name: "Sugar", unit: Unit.KG };
const sugarCubes: ProductType = { identifier: ProductTypeIds.SUGAR_CUBES, name: "Sugar Cubes", unit: Unit.KG };

export const ProcessedProductTypes: ProductType[] = [
  driedGinger,
  slicedBananas,
  bananaJuice,
  roastedCoffee,
  orangeJuice,
  orangeZest,
  sugar,
  sugarCubes
].sort(typeCompare);

export function recipesFor(inputProductId: string): ProductType[] {
  switch(inputProductId) {
    case ProductTypeIds.GINGER: return [driedGinger];
    case ProductTypeIds.BANANAS: return [slicedBananas, bananaJuice];
    case ProductTypeIds.COFFEE_BEANS: return [roastedCoffee];
    case ProductTypeIds.ORANGES: return [orangeJuice, orangeZest];
    case ProductTypeIds.SUGAR_CANE: return [sugar, sugarCubes];
    case ProductTypeIds.SUGAR: return [sugarCubes];
    default: return [];
  }
}

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

