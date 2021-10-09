const ts = require('typescript/lib/tsserver.js');

const LSP_PATH = require.resolve('../../src/lsp');

function addLSPluginOption(options) {
  const plugins = options.plugins || [];

  return {
    ...options,
    plugins: [
      ...plugins,
      {
        name: LSP_PATH
      }
    ]
  };
}

function addLSPlugin(ts) {
  const originalEnablePluginsWithOptions =
    ts.server.ConfiguredProject.prototype.enablePluginsWithOptions;

  ts.server.ConfiguredProject.prototype.enablePluginsWithOptions =
    function enablePluginsWithOptions(options, ...rest) {
      const newOptions = addLSPluginOption(options);

      return originalEnablePluginsWithOptions.call(this, newOptions, ...rest);
    };
}

// TS does not allow paths in plugin name
const { parsePackageName } = ts;
ts.parsePackageName = (moduleName) => {
  if (moduleName === LSP_PATH) {
    return { packageName: moduleName, rest: '' };
  }

  return parsePackageName(moduleName);
};
addLSPlugin(ts);

require('./modify-ts')(ts);
