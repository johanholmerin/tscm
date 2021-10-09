const path = require('path');
const { SourceMapConsumer, SourceMapGenerator } = require('source-map-js');
const { sourcemaps } = require('../shared');

const INLINE_MAP_PREFIX = '//# sourceMappingURL=data:application/json;base64,';

function fromB64(string) {
  return Buffer.from(string, 'base64').toString();
}

function toB64(string) {
  return Buffer.from(string, 'utf8').toString('base64');
}

function isSourceMap(fileName) {
  return fileName.endsWith('.map');
}

function parseMap(string) {
  try {
    return JSON.parse(string);
  } catch {
    return;
  }
}

function translateSourceMap(fileName, map) {
  const newMap = SourceMapGenerator.fromSourceMap(new SourceMapConsumer(map));

  map.sources.forEach((source) => {
    const { dir } = path.parse(fileName);
    const resolvedPath = path.resolve(dir, source);
    const sourcemap = sourcemaps.get(resolvedPath);
    if (!sourcemap) return;

    newMap.applySourceMap(new SourceMapConsumer(sourcemap), source, dir);
  });

  return newMap.toString();
}

function mapInlineSourceMap(fileName, content) {
  const lines = content.split('\n');
  const lastLine = lines.pop();

  if (!lastLine.startsWith(INLINE_MAP_PREFIX)) return content;

  const mapString = fromB64(lastLine.slice(INLINE_MAP_PREFIX.length));
  const map = parseMap(mapString);
  if (!map) return content;

  const newMapString = translateSourceMap(fileName, map);
  const newLastLine = INLINE_MAP_PREFIX + toB64(newMapString);

  return [...lines, newLastLine].join('\n');
}

function mapSourceMap(fileName, content) {
  if (isSourceMap(fileName)) {
    const jsonMap = parseMap(content);
    if (!jsonMap) return content;
    return translateSourceMap(fileName, jsonMap);
  }

  return mapInlineSourceMap(fileName, content);
}

module.exports = { mapSourceMap };
