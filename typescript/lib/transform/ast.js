const ts = require('typescript');
const generator = require('@babel/generator').default;
const { default: traverse, Scope } = require('@babel/traverse');
const { mappings, diagnostics } = require('../shared');
const createVisitor = require('../../../babel/create');

// Prevent exception on colliding declarations
Scope.prototype.checkBlockScopedCollisions = () => {};

function createError({ node, macroName, message, fileName, text }) {
  return ts.createFileDiagnostic(
    {
      fileName,
      text
    },
    node.node.start,
    node.node.end - node.node.start,
    {
      key: 'macro_error',
      category: ts.DiagnosticCategory.Error,
      code: -1,
      message: `Macro ${macroName} error: ${message}`,
      reportsUnnecessary: {},
      reportsDeprecated: {}
    }
  );
}

function transformAst(ast, fileName, text) {
  const replacements = [];
  const errors = [];

  mappings.set(fileName, replacements);
  diagnostics.set(fileName, errors);

  function onReplace(nodePath, newNode) {
    if (newNode) {
      let newCodeString = generator(newNode).code;
      if (newCodeString.endsWith(';')) {
        newCodeString = newCodeString.slice(0, -1);
      }
      replacements.push([
        nodePath.node.start,
        nodePath.node.end,
        newCodeString
      ]);
      nodePath.replaceWith(newNode);
    } else if (nodePath.isImportSpecifier()) {
      const list = nodePath.parentPath.get('specifiers');
      const index = list.indexOf(nodePath);
      const next = list[index + 1];
      const endPosition = next ? next.node.start - 1 : nodePath.node.end;

      replacements.push([
        nodePath.node.start,
        endPosition,
        // Replacing with same length makes error messages better
        ''.padStart(endPosition - nodePath.node.start)
      ]);
    } else {
      replacements.push([
        nodePath.node.start,
        nodePath.node.end,
        // Replacing with same length makes error messages better
        ''.padStart(nodePath.node.end - nodePath.node.start)
      ]);
      nodePath.remove();
    }
  }

  function onError({ node, macroName, message }) {
    errors.push(createError({ node, macroName, message, fileName, text }));
  }

  traverse(
    ast,
    createVisitor({ onReplace, onError, fileName, compiler: 'typescript' })
  );
}

module.exports = { transformAst };
