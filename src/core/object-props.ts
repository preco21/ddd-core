export abstract class ObjectProps {
  // should not be called directly
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(props: any = {}) {
    Object.assign(this, props);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static create<T extends new (props: any) => object>(
    this: T,
    props: InstanceType<T>,
  ): InstanceType<T> {
    // @ts-ignore
    const object = new this() as InstanceType<T>;
    // to compliant the upcoming ECMA runtime behavior
    Object.assign(object, props);
    return object;
  }
}
