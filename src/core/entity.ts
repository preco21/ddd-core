import { IEntity, Id } from '../common/entity';
import { IKeyed, Key } from '../common/keyed';
import { IEquatable } from '../common/equatable';
import { ISerializable, isSerializable } from '../common/serializable';
import { generateGUID } from '../utils/guid';

export abstract class Entity<T> implements IEntity, IKeyed, IEquatable<Entity<T>>, ISerializable {
  public readonly id?: Id;
  public readonly key: Key;
  public readonly createdAt: number;
  protected _props: T;
  private _touched: boolean;
  private _deleted: boolean;

  constructor(props: T, id?: Id) {
    this.id = id ?? undefined;
    this.key = generateGUID();
    this.createdAt = Date.now();
    this._props = props;
    this._touched = false;
    this._deleted = false;
  }

  public get props(): T {
    return this._props;
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
    if (this._props == null) {
      return this._props;
    }
    const output: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(this._props)) {
      // TODO: handle arrays or objects
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

  protected set(props: T): void {
    if (props == null || typeof props !== 'object') {
      this._props = props;
    } else {
      Object.assign(this._props, props);
    }
    this._touched = true;
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
