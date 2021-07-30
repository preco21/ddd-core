export type Id = string;

export interface IEntity {
  id?: Id;
  touched: boolean;
  deleted: boolean;
}
