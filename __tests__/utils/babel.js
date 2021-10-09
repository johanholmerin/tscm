const babel = require('@babel/core');
const plugin = require('../../babel');

function compileString(code) {
  return babel.transformSync(code, {
    filename: 'foo',
    sourceType: 'module',
    plugins: ['@babel/plugin-syntax-typescript', plugin()],
    highlightCode: false
  });
}

function compileFile(fileName) {
  return babel.transformFileSync(fileName, {
    filename: 'foo',
    sourceType: 'module',
    plugins: ['@babel/plugin-syntax-typescript', plugin()],
    highlightCode: false
  });
}

function compile(fileName) {
  try {
    return compileFile(fileName);
  } catch (error) {
    // Remove file name from error message for consistency
    error.message = error.message.replace(`${fileName}: `, '');
    throw error;
  }
}

module.exports = { compile, compileString };
