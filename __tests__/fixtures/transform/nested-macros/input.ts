import { first, second } from './macros';

export const value = first!!({
  prop: second!!('val'),
});
