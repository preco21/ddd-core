import { Key } from '../common/keyed';

export function generateGUID(): Key {
  return String(Math.floor(Math.random() * 0x7FFFFFFF));
}
