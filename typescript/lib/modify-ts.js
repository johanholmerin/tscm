const { transformProgram } = require('./transform/program');
const { normalizeProgramOptions } = require('./utils');

module.exports = function modifyTS(ts) {
  const originalCreateProgram = ts.createProgram.bind(ts);

  ts.createProgram = function createProgram(...args) {
    const options = normalizeProgramOptions(...args);

    return transformProgram(options, ts, originalCreateProgram);
  };
};
