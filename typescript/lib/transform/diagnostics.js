const { diagnostics, mappings } = require('../shared');
const { translatePosBackward } = require('../mapping/position');
const { sortReplacements } = require('../utils');

function isInMacro(diag, map) {
  const sorted = sortReplacements(map);

  for (const [start, end] of sorted) {
    const diagEnd = translatePosBackward(map, diag.start + diag.length);
    if (diag.start >= start && diagEnd <= end) {
      return true;
    }
  }

  return false;
}

function getDiagnostics(sourceFile) {
  if (sourceFile) {
    return diagnostics.get(sourceFile.fileName) ?? [];
  }

  return Array.from(diagnostics.values()).flat();
}

function patchDiagFunc(program, name, includeMacroDiag) {
  const originalFunc = program[name];

  program[name] = function (sourceFile) {
    const diags = originalFunc.apply(this, arguments).filter((diag) => {
      const fileName = diag.file.originalFileName || diag.file.fileName;
      const map = mappings.get(fileName) ?? [];
      return !isInMacro(diag, map);
    });

    if (includeMacroDiag) {
      diags.push(...getDiagnostics(sourceFile));
    }

    return diags;
  };
}

function patchProgramDiagnostics(program) {
  patchDiagFunc(program, 'getSuggestionDiagnostics', false);
  patchDiagFunc(program, 'getSyntacticDiagnostics', true);
  patchDiagFunc(program, 'getSemanticDiagnostics', true);
}

module.exports = { patchProgramDiagnostics };
