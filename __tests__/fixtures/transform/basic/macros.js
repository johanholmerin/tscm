const t = require('@babel/types');

module.exports.sql = function sql() {
  return t.expressionStatement(
    Object.assign(
      t.callExpression(
        t.memberExpression(t.identifier('Promise'), t.identifier('resolve')),
        [t.arrayExpression()]
      ),
      {
        typeParameters: t.tsTypeParameterInstantiation([
          t.tsArrayType(
            t.tsTypeLiteral([
              t.tsPropertySignature(
                t.identifier('id'),
                t.tsTypeAnnotation(t.tsStringKeyword())
              )
            ])
          )
        ])
      }
    )
  );
};

module.exports.styles = function styles() {
  return t.arrayExpression([]);
};

module.exports.validate = function validate({ node }) {
  return t.expressionStatement(
    Object.assign(
      t.callExpression(
        t.memberExpression(t.identifier('Promise'), t.identifier('resolve')),
        [t.arrayExpression()]
      ),
      {
        typeParameters: t.tsTypeParameterInstantiation([
          t.tsArrayType(node.typeParameters.params[0])
        ])
      }
    )
  );
};
