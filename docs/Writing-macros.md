# Writing macros

A macro is a function that receives a [Babel CallExpression Node](https://babeljs.io/docs/en/babel-types#callexpression) and returns a new Node. They can not change or access code elsewhere in the program. They can receive any TypeScript code that is valid in a function call, including type parameters, and can return any valid TypeScript code.

## Example

A macro that takes two numbers, adds them together and returns the result.

```javascript
const assert = require('assert');
const t = require('@babel/types');

/**
 * @type {import('tscm/macro').Macro}
 */
module.exports.add = function add({ node }) {
  assert.equal(node.arguments.length, 2, 'Expected two arguments');
  const [firstNumber, secondNumber] = node.arguments;
  t.assertNumericLiteral(firstNumber);
  t.assertNumericLiteral(secondNumber);

  const sum = firstNumber.value + secondNumber.value;

  return t.numericLiteral(sum);
};
```

Use by importing and calling with two non-null-assertion operators.

```typescript
import { add } from './add';

const sum = add!!(4, 3);
```

More macro examples can be found in the [tscm-examples](https://github.com/johanholmerin/tscm-examples) repository.

## Things to be aware of

- Macros are not hygienic. If you use identifiers provided to the macro, they may clash with identifiers you create. Make sure to use unique names.
- Since macros can't affect the rest of the program, they receive a `Node`, not a `NodePath` as receive by `@babel/traverse` visitors.
- Macros are executed directly in node. Therefore they need to be in JavaScript, not TypeScript. You can of course compile them before using.
- Macros have to be defined in a separate file and be imported

## Arguments

Macros receive an object with `node`, `fileName`, and `compiler` properties. For details see [macro.d.ts](../macro.d.ts).

## Error reporting

Issues are reported by throwing an Error with a helpful message, which will be displayed in the correct position.

## Async logic

The TypeScript compiler is completely synchronous. Therefore macros can not include any asynchronous code. If you need to read a file, this means using the `fs.*Sync` APIs. There are solutions for running async code synchronously, using `child_process` or `worker_threads`, and libraries exist that make them easier to use(see below), but be aware that they may cause performance issues. If neccessary for generating types, make sure to only use them when the `typescript` compiler is used, not `babel`.

## Useful tools

- [AST Builder](https://rajasegar.github.io/ast-builder/) - Generate builder
  calls from code. Make sure to select `babel` parser.
- [AST Explorer](https://astexplorer.net/) - Make sure to select `@babel/parser`
- [@babel/template](https://babeljs.io/docs/en/babel-template.html) - Create AST from string template
- [do-sync](https://github.com/Zemnmez/do-sync) - Run async code synchronously usinc child_process.
- [sync-threads](https://github.com/lambci/sync-threads) - Run async code synchronously using Workers.
