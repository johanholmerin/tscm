// Replaces executing line in tsc with export

const vm = require('vm');
const path = require('path');
const TSC_PATH = require.resolve('typescript/lib/tsc.js');
const tscFile = require('fs')
  .readFileSync(TSC_PATH, { encoding: 'utf8' })
  .replace(
    'ts.executeCommandLine(ts.sys, ts.noop, ts.sys.args)',
    'module.exports = ts'
  );
const sandbox = {
  clearImmediate,
  clearInterval,
  clearTimeout,
  setImmediate,
  setInterval,
  setTimeout,
  global,
  process,
  module: {},
  exports: {},
  require,
  __filename: TSC_PATH,
  __dirname: path.dirname(TSC_PATH)
};
const ts = vm.runInNewContext(tscFile, sandbox, { filename: TSC_PATH });

require('./modify-ts')(ts);

ts.executeCommandLine(ts.sys, ts.noop, ts.sys.args);
