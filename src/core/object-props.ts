export type PlainProps<T> = Omit<T, '__brand__'>;

export abstract class ObjectProps<T> {
  protected readonly __brand__: Symbol = Symbol('ObjectProps');

  constructor(props: PlainProps<T> = {} as PlainProps<T>) {
    Object.assign(this, props);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static create<T extends new (props: any) => object>(
    this: T,
    props: PlainProps<InstanceType<T>>,
  ): InstanceType<T> {
    // @ts-ignore
    const object = new this() as InstanceType<T>;
    // to compliant the upcoming ECMA runtime behavior
    Object.assign(object, props);
    return object;
  }
}
