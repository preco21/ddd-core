export type Id = string;

export interface IEntity {
  id?: Id;
  isTransient(): boolean;
}
