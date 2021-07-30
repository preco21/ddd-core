import { IEquatable } from '../common/equatable';
import { ISerializable, isSerializable, serialize } from '../common/serializable';

export abstract class ValueObject<T> implements IEquatable<ValueObject<T>>, ISerializable {
  protected readonly props: T;

  constructor(props: T) {
    this.props = props;
  }

  public equals(other?: ValueObject<T>): boolean {
    if (other == null || !isValueObject(other)) {
      return false;
    }
    if (this.props === other.props) {
      return true;
    }
    if (this.props == null || other.props == null) {
      return false;
    }
    const keysA = Object.keys(this.props);
    const keysB = Object.keys(other.props);
    if (keysA.length !== keysB.length) {
      return false;
    }
    return keysA.every((key) => {
      if (!Object.prototype.hasOwnProperty.call(other.props, key)) {
        return false;
      }
      const valA = this.props[key as keyof T];
      const valB = other.props[key as keyof T];
      if (isValueObject(valA) && isValueObject(valB)) {
        return valA.equals(valB);
      }
      if (isSerializable(valA) && isSerializable(valB)) {
        return valA.toJSON() === valB.toJSON();
      }
      return valA === valB;
    });
  }

  public toJSON(): unknown {
    return serialize(this.props);
  }

  public getRaw(): T {
    return this.props;
  }
}

export function isValueObjectEqual<T>(
  a?: ValueObject<T>,
  b?: ValueObject<T>,
): boolean {
  if (a == null || !isValueObject(a)) {
    return false;
  }
  return a.equals(b);
}

export function isValueObject(
  object: unknown,
): object is ValueObject<unknown> {
  return object instanceof ValueObject;
}
