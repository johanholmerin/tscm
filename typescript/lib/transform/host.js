const ts = require('typescript');
const babel = require('@babel/parser');
const { diagnostics } = require('../shared');
const { mapSourceMap } = require('../mapping/source-map');
const { transformAst } = require('./ast');
const { updateSourceFile } = require('./updated-source');

// Cache map from original to updated SourceFile
const CACHE = new WeakMap();

function transform(text, fileName) {
  const ast = babel.parse(text, {
    errorRecovery: true,
    sourceType: 'module',
    plugins: ['typescript', 'jsx']
  });
  transformAst(ast, fileName, text);
}

function transformHost(host, rootNames) {
  const { getSourceFile, writeFile } = host;

  host.getSourceFile = function (fileName) {
    const sourceFile = getSourceFile.apply(this, arguments);
    if (
      fileName.endsWith('.json') ||
      fileName.endsWith('.d.ts') ||
      !rootNames.includes(fileName)
    ) {
      return sourceFile;
    }

    if (CACHE.has(sourceFile)) {
      return CACHE.get(sourceFile);
    }

    // Report error and delegate to TS, which returns something instead of
    // crashing. Might lead to duplicate reporting, if TS gets the same error.
    try {
      transform(sourceFile.text, fileName);
    } catch (error) {
      const diag = ts.createFileDiagnostic(sourceFile, error.pos ?? 0, 0, {
        key: 'babel_error',
        category: ts.DiagnosticCategory.Error,
        code: -2,
        message: `Babel error: ${error.message}`,
        reportsUnnecessary: {},
        reportsDeprecated: {}
      });
      diagnostics.set(fileName, [diag]);
      return sourceFile;
    }

    const updatedSourceFile = updateSourceFile(sourceFile, ts, false);
    CACHE.set(sourceFile, updatedSourceFile);

    return updatedSourceFile;
  };
  host.writeFile = function (fileName, data, ...rest) {
    const newData = mapSourceMap(fileName, data);

    return writeFile.call(this, fileName, newData, ...rest);
  };

  return host;
}

module.exports = { transformHost };
