export interface ISerializable {
  toJSON(): unknown;
}

export function isSerializable(
  object?: unknown,
): object is ISerializable {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return object != null && typeof object === 'object' && 'toJSON' in (object as any);
}

export function serialize<T>(input: T): unknown {
  if (input == null || typeof input !== 'object') {
    return input;
  }
  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (isSerializable(value)) {
      output[key] = value.toJSON();
    } else if (Array.isArray(value)) {
      output[key] = value.map((e) => serialize(e));
    } else if (value != null && typeof value === 'object') {
      output[key] = Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, serialize(v)]),
      );
    } else {
      output[key] = value;
    }
  }
  return output;
}
