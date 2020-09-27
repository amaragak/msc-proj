export function truthyFields(contract: any): boolean {
  const keys = Object.keys(contract);
  for (var i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = Reflect.get(contract, key);
    console.log(value);
    if (!value) {
      console.log(key);
      return false;
    }
    if (value instanceof Object) return truthyFields(value);
  }
  return true;
}
