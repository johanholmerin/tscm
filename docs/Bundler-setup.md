# Bundler setup

## Webpack

```javascript
const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build')
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          compiler: 'tscm',
          transpileOnly: true
        }
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        typescriptPath: 'tscm'
      }
    })
  ]
};
```

## Rollup

```javascript
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'build',
    format: 'esm'
  },
  plugins: [
    typescript({
      typescript: require('tscm')
    })
  ]
};
```

## ts-node

```javascript
ts-node --compiler tscm ./src/index.ts
```

## Jest(ts-jest)

```javascript
module.exports = {
  globals: {
    'ts-jest': {
      compiler: 'tscm'
    }
  }
};
```

## Babel plugin

There is also a babel plugin, to support using the same macros without the TypeScript compiler. Useful if you run babel and TypeScript in parallel for faster compile times.

The `compiler` parameter can be used for plugins to determine which compiler is used, and only generate types for TypeScript compiler.

```javascript
const babel = require('@babel/core');

const output = babel.transformFile('./file.js', {
  plugins: ['typescript', 'tscm/babel']
});
```
