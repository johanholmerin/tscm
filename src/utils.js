const util = require('util');
const { mappings } = require('../typescript/lib/shared');
const {
  translatePosBackward,
  translatePosForward
} = require('../typescript/lib/mapping/position');

function log(info, ...message) {
  info.project.projectService.logger.info(`[tscm] ${util.format(...message)}`);
}

function translateLocBackward(map, { start, length }) {
  return {
    start: translatePosBackward(map, start),
    length
  };
}

function createMapper(name, resultMapper) {
  return function mapper(fileName, position, ...rest) {
    if (!mappings.has(fileName)) {
      return this.languageService[name](fileName, position, ...rest);
    }

    const map = mappings.get(fileName);
    const newPosition = translatePosForward(map, position);
    const result = this.languageService[name](fileName, newPosition, ...rest);
    if (!result) return;

    return resultMapper.call(this, map, result);
  };
}

module.exports = { log, translateLocBackward, createMapper };
