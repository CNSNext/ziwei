export function freeze<T extends object>(n: T) {
  return Object.freeze(n);
}

export function keys<T extends object>(n: T) {
  return Object.keys(n) as (keyof T)[];
}

export function values<T extends object>(n: T) {
  return Object.values(n) as T[keyof T][];
}

export function mapKeys<T extends Record<PropertyKey, unknown>, K extends PropertyKey>(
  object: T,
  getNewKey: (value: T[keyof T], key: keyof T, object: T) => K,
): Record<K, T[keyof T]> {
  const result = {} as Record<K, T[keyof T]>;
  const keys = Object.keys(object) as Array<keyof T>;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = object[key];
    result[getNewKey(value, key, object)] = value;
  }

  return result;
}

export function mapValues<T extends object, K extends keyof T, V>(
  object: T,
  getNewValue: (value: T[K], key: K, object: T) => V,
): Record<K, V> {
  const result = {} as Record<K, V>;
  const keys = Object.keys(object);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i] as K;
    const value = object[key];
    result[key] = getNewValue(value, key, object);
  }

  return result;
}
