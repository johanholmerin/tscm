const ts = require('typescript');
const { sources } = require('../typescript/lib/shared');
const { createMapper } = require('./utils');
const mappers = require('./mappers');

const getQuickInfoAtPosition = createMapper(
  'getQuickInfoAtPosition',
  mappers.QuickInfo
);
const getRenameInfo = createMapper('getRenameInfo', mappers.RenameInfo);
const findRenameLocations = createMapper(
  'findRenameLocations',
  mappers.DocumentSpanList
);
const getSemanticDiagnostics = createMapper(
  'getSemanticDiagnostics',
  mappers.DiagnosticList
);
const getSyntacticDiagnostics = createMapper(
  'getSyntacticDiagnostics',
  mappers.DiagnosticList
);
const getSuggestionDiagnostics = createMapper(
  'getSuggestionDiagnostics',
  mappers.DiagnosticList
);
const getDefinitionAtPosition = createMapper(
  'getDefinitionAtPosition',
  mappers.DocumentSpanList
);
const getTypeDefinitionAtPosition = createMapper(
  'getTypeDefinitionAtPosition',
  mappers.DocumentSpanList
);
const getImplementationAtPosition = createMapper(
  'getImplementationAtPosition',
  mappers.DocumentSpanList
);
const getDefinitionAndBoundSpan = createMapper(
  'getDefinitionAndBoundSpan',
  mappers.DefinitionInfoAndBoundSpan
);
const getEncodedSemanticClassifications = createMapper(
  'getEncodedSemanticClassifications',
  mappers.Classifications
);

function toLineColumnOffset(fileName, position) {
  if (!sources.has(fileName)) {
    return this.languageService.toLineColumnOffset(
      fileName,
      position,
      position
    );
  }

  if (position < 0) {
    return { line: -1, character: -1 };
  }

  // Same logic as built-in, but based on source text
  const text = sources.get(fileName);
  const lineStarts = ts.getLineStarts({ text });
  return ts.computeLineAndCharacterOfPosition(lineStarts, position);
}

module.exports = {
  getQuickInfoAtPosition,
  getRenameInfo,
  getSemanticDiagnostics,
  getSyntacticDiagnostics,
  getSuggestionDiagnostics,
  findRenameLocations,
  getDefinitionAtPosition,
  getTypeDefinitionAtPosition,
  getImplementationAtPosition,
  getDefinitionAndBoundSpan,
  getEncodedSemanticClassifications,
  toLineColumnOffset
};
