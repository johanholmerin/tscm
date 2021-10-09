const { sortReplacements } = require('../utils');

function translatePosForward(replacements, pos) {
  const sorted = sortReplacements(replacements);

  let newPos = pos;

  for (const [start, end, value] of sorted) {
    if (start <= pos) {
      // Inside replacement, bail
      if (end > pos) {
        return -1;
      }

      newPos += start + value.length - end;
    }
  }

  return newPos;
}

function translatePosBackward(replacements, pos) {
  const sorted = sortReplacements(replacements);

  let newPos = pos;

  for (const [start, end, value] of sorted) {
    if (start < newPos) {
      newPos -= start + value.length - end;
    }
  }

  return newPos;
}

module.exports = {
  translatePosBackward,
  translatePosForward
};
