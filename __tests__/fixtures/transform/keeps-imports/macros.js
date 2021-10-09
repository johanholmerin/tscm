const t = require('@babel/types');

module.exports.sql = function sql() {
  return t.arrayExpression([]);
};

module.exports.other = function other() {
  return t.objectExpression([]);
};
