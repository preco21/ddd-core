export type MixinFactory<T extends new (...args: any[]) => object> = (
  props: InstanceType<T>,
  ...args: ConstructorParameters<T>
) => InstanceType<T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createMixinFactory<T extends new (...args: any[]) => object>(
  constructor: T,
) {
  return (
    props: InstanceType<T>,
    ...args: ConstructorParameters<T>
  ): InstanceType<T> => {
    const object = new constructor(...args) as InstanceType<T>;
    Object.assign(object, props);
    return object;
  };
}
