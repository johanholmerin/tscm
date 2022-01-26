const { translatePosBackward } = require('../typescript/lib/mapping/position');
const { translateLocBackward } = require('./utils');

function QuickInfo(map, result) {
  return {
    ...result,
    textSpan: translateLocBackward(map, result.textSpan)
  };
}

function RenameInfo(map, result) {
  if (!result.canRename) return result;

  return {
    ...result,
    triggerSpan: translateLocBackward(map, result.triggerSpan)
  };
}

function DiagnosticList(map, result) {
  return result.map((loc) => {
    return {
      ...loc,
      ...translateLocBackward(map, loc)
    };
  });
}

function DocumentSpanList(map, result) {
  return result.map((loc) => {
    const newLoc = {
      ...loc,
      textSpan: translateLocBackward(map, loc.textSpan)
    };
    if (loc.contextSpan) {
      newLoc.contextSpan = translateLocBackward(map, loc.contextSpan);
    }
    if (loc.originalTextSpan) {
      newLoc.originalTextSpan = translateLocBackward(map, loc.originalTextSpan);
    }

    return newLoc;
  });
}

function DefinitionInfoAndBoundSpan(map, result) {
  const definitions =
    result.definitions && DocumentSpanList(map, result.definitions);

  return {
    ...result,
    definitions,
    textSpan: translateLocBackward(map, result.textSpan)
  };
}

function Classifications(map, result) {
  return {
    ...result,
    spans: result.spans.map((span) => translatePosBackward(map, span))
  };
}

module.exports = {
  QuickInfo,
  RenameInfo,
  DiagnosticList,
  DocumentSpanList,
  DefinitionInfoAndBoundSpan,
  Classifications
};
