const MagicString = require('magic-string');
const { mappings, sourcemaps, sources } = require('../shared');
const { generateDjb2Hash } = require('../utils');

function updateSourceFile(sourceFile, ts, includeContent) {
  const ms = new MagicString(sourceFile.text, {
    filename: sourceFile.fileName
  });

  const replacements = mappings.get(sourceFile.fileName) ?? [];
  replacements.forEach(([start, end, value]) => {
    ms.overwrite(start, end, value);
  });

  const updatedSourceFile = ts.createSourceFile(
    sourceFile.fileName,
    ms.toString(),
    sourceFile.languageVersion
  );

  updatedSourceFile.version = generateDjb2Hash(updatedSourceFile.text);

  sources.set(sourceFile.fileName, sourceFile.text);
  sourcemaps.set(
    sourceFile.fileName,
    ms.generateMap({
      includeContent,
      source: sourceFile.fileName,
      hires: true
    })
  );
  return updatedSourceFile;
}

module.exports = { updateSourceFile };
