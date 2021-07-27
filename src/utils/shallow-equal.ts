export function shallowEqual(a: unknown, b: unknown): boolean {
  if (a == null || b == null) {
    return a === b;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    return a.every((e, i) => e === b[i]);
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const aKeys = Object.keys(a!);
    const bKeys = Object.keys(b!);
    if (aKeys.length !== bKeys.length) {
      return false;
    }
    // @ts-ignore
    return aKeys.every((key, i) => key === bKeys[i] && a[key] === b[key]);
  }
  return a === b;
}
