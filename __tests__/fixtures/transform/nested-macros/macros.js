const t = require('@babel/types');

module.exports.first = function first({ node }) {
  return t.arrayExpression(node.arguments);
};

module.exports.second = function second({ node }) {
  return t.stringLiteral(`second: ${node.arguments[0].value}`);
};
