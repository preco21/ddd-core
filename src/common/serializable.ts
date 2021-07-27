export interface ISerializable {
  toJSON(): unknown;
}

export function isSerializable(
  object?: unknown,
): object is ISerializable {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return object != null && typeof object === 'object' && 'toJSON' in (object as any);
}
