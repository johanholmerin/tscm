const { mapSourceMap } = require('../../typescript/lib/mapping/source-map');
const { sourcemaps } = require('../../typescript/lib/shared');

function toB64(string) {
  return Buffer.from(string, 'utf8').toString('base64');
}

const SOURCE_INPUT =
  '                                               \n\n(() => {\n  return 1;\n})();\n\nexport const query = Promise.resolve<{\n  id: string;\n}[]>([]);;\nexport const cls = [];\nexport const validator = Promise.resolve<{\n  foo: string;\n}[]>([]);;\n';
const SOURCE_OUTPUT = `(() => {
    return 1;
})();
export const query = Promise.resolve([]);
;
export const cls = [];
export const validator = Promise.resolve([]);
;`;
const INPUT_MAP = {
  version: 3,
  file: '/OUTPUT.js',
  sourceRoot: '',
  sources: ['/INPUT.ts'],
  names: [],
  mappings:
    'AAEA,CAAC,GAAG,EAAE;IACJ,OAAO,CAAC,CAAC;AACX,CAAC,CAAC,EAAE,CAAC;AAEL,MAAM,CAAC,MAAM,KAAK,GAAG,OAAO,CAAC,OAAO,CAE/B,EAAE,CAAC,CAAC;AAAA,CAAC;AACV,MAAM,CAAC,MAAM,GAAG,GAAG,EAAE,CAAC;AACtB,MAAM,CAAC,MAAM,SAAS,GAAG,OAAO,CAAC,OAAO,CAEnC,EAAE,CAAC,CAAC;AAAA,CAAC',
  sourcesContent: [SOURCE_INPUT]
};
const OUTPUT_MAP = {
  version: 3,
  sources: ['/INPUT.ts'],
  names: [],
  mappings:
    'AAEA,CAAC,GAAG,EAAE;IACJ,OAAO,CAAC,CAAC;AACX,CAAC,CAAC,EAAE,CAAC;AAEL,MAAM,CAAC,MAAM,KAAK,GAAG,OAAA,CAAA,OAAA,CAEhB,EAAE,CAAC,CAF2C;AAAA,CAAC;AACpD,MAAM,CAAC,MAAM,GAAG,GAAG,EAEjB,CAAC;AACH,MAAM,CAAC,MAAM,SAAS,GAAG,OAAA,CAAA,OAAA,CAEpB,EAAE,CAAC,CAF8C;AAAA,CAAC',
  file: '/OUTPUT.js',
  sourceRoot: '',
  sourcesContent: [SOURCE_INPUT]
};

beforeEach(() => {
  sourcemaps.set('/INPUT.ts', {
    version: 3,
    file: null,
    sources: ['/INPUT.ts'],
    sourcesContent: [null],
    names: [],
    mappings:
      'AAAA,+CAA+C;AAC/C;AACA,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC;AACR,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC;AACX,CAAC,CAAC,CAAC,CAAC,CAAC;AACL;AACA,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC;;SAA8B,CAAC;AACpD,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAEjB,CAAC;AACH,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC;;SAA6B,CAAC;'
  });
});

describe('mapSourceMap', () => {
  it('maps external source map', () => {
    const fileName = '/OUTPUT.js.map';
    expect(
      JSON.parse(mapSourceMap(fileName, JSON.stringify(INPUT_MAP)))
    ).toEqual(OUTPUT_MAP);
  });

  it('maps inline source map', () => {
    const fileName = '/OUTPUT.js';
    const INPUT = [
      SOURCE_OUTPUT,
      '//# sourceMappingURL=data:application/json;base64,' +
        toB64(JSON.stringify(INPUT_MAP))
    ].join('\n');
    const OUTPUT = [
      SOURCE_OUTPUT,
      '//# sourceMappingURL=data:application/json;base64,' +
        toB64(JSON.stringify(OUTPUT_MAP))
    ].join('\n');
    expect(mapSourceMap(fileName, INPUT)).toEqual(OUTPUT);
  });
});
