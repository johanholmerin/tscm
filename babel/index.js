const NAME = require('../package.json').name;
const createVisitor = require('./create');

function onReplace(nodePath, newNode) {
  if (newNode) {
    nodePath.replaceWith(newNode);
  } else {
    nodePath.remove();
  }
}

function onError({ node, macroName, message }) {
  throw node.buildCodeFrameError(`Macro ${macroName} error: ${message}`);
}

module.exports = function tscmPlugin() {
  return {
    name: NAME,
    visitor: createVisitor({ onReplace, onError, compiler: 'babel' })
  };
};
