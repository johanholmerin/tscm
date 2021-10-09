const { patchProgramDiagnostics } = require('./diagnostics');
const { transformHost } = require('./host');

function getHost({ host, options, rootNames }, ts) {
  const newHost = host ?? ts.createCompilerHost(options, true);

  return transformHost(newHost, rootNames);
}

function transformProgram(createProgramOptions, ts, originalCreateProgram) {
  const newHost = getHost(createProgramOptions, ts);
  const newProgram = originalCreateProgram({
    ...createProgramOptions,
    host: newHost
  });
  patchProgramDiagnostics(newProgram);

  return newProgram;
}

module.exports = { transformProgram };
