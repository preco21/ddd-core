import { IEntity, Id } from '../common/entity';
import { IKeyed, Key } from '../common/keyed';
import { IEquatable } from '../common/equatable';
import { ISerializable, isSerializable } from '../common/serializable';
import { generateGUID } from '../utils/guid';

export abstract class Entity<T> implements IEntity, IKeyed, IEquatable<Entity<T>>, ISerializable {
  public readonly id?: Id;
  public readonly key: Key;
  public readonly createdAt: number;
  protected readonly props: T;

  constructor(props: T, id?: Id) {
    this.id = id ?? undefined;
    this.key = generateGUID();
    this.createdAt = Date.now();
    this.props = props;
  }

  public equals(other?: Entity<T>): boolean {
    if (other == null || !isEntity(other)) {
      return false;
    }
    if (this === other) {
      return true;
    }
    if (this.id == null || other.id == null) {
      return false;
    }
    return this.id === other.id;
  }

  public isTransient(): boolean {
    return this.id != null;
  }

  public toJSON(): unknown {
    if (this.props == null) {
      return this.props;
    }
    const output: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(this.props)) {
      if (isSerializable(value)) {
        output[key] = value.toJSON();
      } else {
        output[key] = value;
      }
    }
    output['_id'] = this.id;
    output['_key'] = this.key;
    output['_createdAt'] = this.createdAt;
    return output;
  }
}

export function isEntityEqual<T>(
  a?: Entity<T>,
  b?: Entity<T>,
): boolean {
  if (a == null || !isEntity(a)) {
    return false;
  }
  return a.equals(b);
}

export function isEntity(
  object: unknown,
): object is Entity<unknown> {
  return object instanceof Entity;
}
