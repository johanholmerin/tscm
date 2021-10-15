const path = require('path');
const resolve = require('resolve');

function createVisitor({ onReplace, onError, fileName, compiler }) {
  const impDecs = new Set();
  // Counts number of remaining references
  const impSpecs = new Map();

  return {
    CallExpression: {
      exit(nodePath, state) {
        const currentFileName = state?.filename ?? fileName;
        if (
          !nodePath.get('callee').isTSNonNullExpression() ||
          !nodePath.get('callee.expression').isTSNonNullExpression()
        ) {
          return;
        }

        const macroName = nodePath.get('callee.expression.expression').node
          .name;
        const binding = nodePath.getStatementParent().scope.bindings[macroName];
        if (!binding) return;
        const impDec = binding.path.parentPath;

        if (impDec.type !== 'ImportDeclaration') return;
        nodePath.skip();

        const importStr = impDec.node.source.value;
        const basedir = path.parse(currentFileName).dir;
        const { node } = nodePath;

        let resolvedPath;
        try {
          resolvedPath = resolve.sync(importStr, { basedir });
        } catch (error) {
          onError({
            node: impDec,
            macroName,
            message: `Cannot find module '${importStr}'`
          });

          return;
        }

        const module = require(resolvedPath);

        const func = module[macroName];
        if (!func) {
          onError({
            node: impDec,
            macroName,
            message: `Function ${macroName} does not exist in '${importStr}'`
          });

          return;
        }

        let newCode;
        try {
          newCode = func({ node, fileName: currentFileName, compiler });
        } catch (error) {
          onError({
            node: nodePath,
            macroName,
            message: error?.message ?? 'Unknown'
          });

          return;
        }

        onReplace(nodePath, newCode);

        const impSpec = binding.path;
        if (!impSpecs.has(impSpec)) {
          impSpecs.set(impSpec, binding.references);
        }
        impDecs.add(impDec);
        impSpecs.set(impSpec, impSpecs.get(impSpec) - 1);
      }
    },
    Program: {
      exit() {
        for (const impDec of impDecs) {
          const removeAll = impDec.get('specifiers').every((impSpec) => {
            return impSpecs.get(impSpec) === 0;
          });

          if (removeAll) {
            impDec.get('specifiers').forEach((impSpec) => {
              impSpecs.delete(impSpec);
            });
            onReplace(impDec);
          } else {
            impDec.get('specifiers').forEach((impSpec) => {
              const shouldRemove = impSpecs.get(impSpec) === 0;
              if (!shouldRemove) return;

              onReplace(impSpec);
            });
          }
        }
      }
    }
  };
}

module.exports = createVisitor;
