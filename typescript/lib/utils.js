/**
 * djb2 hashing algorithm
 * http://www.cse.yorku.ca/~oz/hash.html
 */
function generateDjb2Hash(data) {
  let acc = 5381;

  for (let i = 0; i < data.length; i++) {
    acc = (acc << 5) + acc + data.charCodeAt(i);
  }

  return acc.toString();
}

function normalizeProgramOptions(
  rootNames,
  options,
  host,
  oldProgram,
  configFileParsingDiagnostics
) {
  if (Array.isArray(rootNames)) {
    return {
      rootNames,
      options,
      projectReferences: [],
      host,
      oldProgram,
      configFileParsingDiagnostics
    };
  }

  return rootNames;
}

function sortReplacements(replacements) {
  return Array.from(replacements)
    .sort(([a], [b]) => a - b)
    .filter((replacement) => {
      // Removes nested positions
      const wrapping = replacements.find(
        ([start, end]) => replacement[0] > start && replacement[1] < end
      );
      return !wrapping;
    });
}

module.exports = {
  generateDjb2Hash,
  normalizeProgramOptions,
  sortReplacements
};
