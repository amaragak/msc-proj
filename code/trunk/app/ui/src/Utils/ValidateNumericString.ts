export function validateNumericString(quantityStr: string): boolean {
  if (Number.isNaN(Number(quantityStr))) return false;
  const asNumber: number = +quantityStr;
  return (asNumber > 0);
}
