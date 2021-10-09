const methods = require('./methods');

function create(info) {
  const proxy = { ...info.languageService };

  for (const key in methods) {
    proxy[key] = methods[key].bind(info);
  }
  return proxy;
}

function init() {
  return { create };
}

module.exports = init;
