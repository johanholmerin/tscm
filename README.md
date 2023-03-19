# Deprecated

Since TypeScript 5 this project is no longer supported

---

# tscm

Function-like macros for TypeScript, inspired by Rust

- Fully type-checked
- IDE support - correct messages, types and diagnostics while editing
- easy to use, easy to write
- Generates correct source-maps
- [Compatible Babel plugin](docs/Bundler-setup.md#babel-plugin)

For a collection of example macros, like [GraphQL][gql] or [SQL][sql], see the [tscm-examples][tscm-examples] repository.

## Installation

Bring your own TypeScript, version 4.0 or higher

```sh
# Yarn
yarn add -D tscm typescript

# npm
npm install -D tscm typescript
```

## Example

#### Usage

```typescript
// macros are imported like normal
import { macro } from './macros';

// Two non-null-assertion operators are used as indicator for macro calls
const val = macro!!('literal', identifier);
```

#### Macro definition

Macros are normal functions that get the CallExpression Node as parameter and return a new Node. They can be local files or npm packages. For more information see the [Writing macros](docs/Writing-macros.md) guide.

```javascript
const t = require('@babel/types');

/**
 * @type {import('tscm/macro').Macro}
 */
module.exports.macro = function ({ node }) {
  // Returns that arguments as an array
  return t.arrayExpression(node.arguments);
};
```

## Compiling

To compile, use tscm instead of tsc. If you are using a bundler, see [Bundler setup](docs/Bundler-setup.md).

```sh
npx tscm
```

## Editor config

To get the correct types in your editor, make sure to point it to `tscm`.

### coc.nvim

```javascript
// .vim/coc-settings.json
{
  "tsserver.ignoreLocalTsserver": true,
  "tsserver.tsdk": "./node_modules/tscm/typescript/lib"
}
```

### VS Code

Make sure to select `Use Workspace Version` under `TypeScript: Select TypeScript version`

```javascript
// .vscode/settings.json
{
  "typescript.tsdk": "./node_modules/tscm/typescript/lib"
}
```

## Documentation

1. [Bundler setup](docs/Bundler-setup.md)
1. [Writing macros](docs/Writing-macros.md)
1. [How it works](docs/How-it-works.md)

[tscm-examples]: https://github.com/johanholmerin/tscm-examples
[gql]: https://github.com/johanholmerin/tscm-examples/tree/master/macros/graphql
[sql]: https://github.com/johanholmerin/tscm-examples/tree/master/macros/pgtyped
