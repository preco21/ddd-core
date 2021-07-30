import { IEntity, Id } from '../common/entity';
import { IKeyed, Key } from '../common/keyed';
import { IEquatable } from '../common/equatable';
import { ISerializable, serialize } from '../common/serializable';
import { generateGUID } from '../utils/guid';

export abstract class Entity<T extends object>
implements IEntity, IKeyed, IEquatable<Entity<T>>, ISerializable {
  public readonly id?: Id;
  public readonly key: Key;
  public readonly createdAt: number;
  public readonly props: T;
  private readonly _props: T;
  private _touched: boolean;
  private _deleted: boolean;

  constructor(props: T, id?: Id) {
    this.id = id ?? undefined;
    this.key = generateGUID();
    this.createdAt = Date.now();
    this._touched = false;
    this._deleted = false;
    this._props = props;
    this.props = new Proxy<T>(this._props, {
      set: (target, prop, value, receiver) => {
        this._touched = true;
        return Reflect.set(target, prop, value, receiver);
      },
    });
  }

  public get touched(): boolean {
    return this._touched;
  }

  public get deleted(): boolean {
    return this._deleted;
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
    return this.id == null;
  }

  public touch(): void {
    this._touched = true;
  }

  public discard(): void {
    this._deleted = true;
  }

  public toJSON(): unknown {
    const output = serialize(this._props) as Record<string, unknown>;
    output['_id'] = this.id;
    output['_key'] = this.key;
    output['_createdAt'] = this.createdAt;
    return output;
  }
}

export function isEntityEqual<T extends object>(
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
): object is Entity<object> {
  return object instanceof Entity;
}
