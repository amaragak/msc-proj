// Simulate product type fetch from database

export interface ProductType {
  identifier: string;
  name: string;
  unit: 'kg' | 'litres'; //maybe delete (the product type dataset may not come with units)
};

export const ProductTypes: ProductType[] = [
  { identifier: "1", name: "Dried Ginger", unit: "kg" },
  { identifier: "2", name: "Coconut Milk", unit: "litres"}
];
