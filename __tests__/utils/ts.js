const ts = require('typescript');
require('../../typescript/lib/modify-ts')(ts);

const options = {
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext,
  strict: true
};

function createHost() {
  return ts.createCompilerHost(options);
}

function createProgram(fileName, host) {
  return ts.createProgram([fileName], options, host);
}

function compile(fileName) {
  const host = createHost();
  const program = createProgram(fileName, host);
  const sourceFile = program.getSourceFile(fileName);
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const code = printer.printFile(sourceFile);

  return { code };
}

module.exports = { compile, createHost, createProgram };
