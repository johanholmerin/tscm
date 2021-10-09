import { sql, styles, validate } from './macros';

(() => {
  return 1;
})();

export const query = sql!!('SELECT id from items;');
export const cls = styles!!({
  color: 'red'
});
export const validator = validate!!<{ foo: string }>();
