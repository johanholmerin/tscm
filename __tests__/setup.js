const { toMatchFile } = require('jest-file-snapshot');
const {
  mappings,
  sourcemaps,
  sources,
  diagnostics,
  sequences
} = require('../typescript/lib/shared');

beforeEach(() => {
  mappings.clear();
  sourcemaps.clear();
  sources.clear();
  diagnostics.clear();
  sequences.clear();
});

expect.extend({ toMatchFile });
