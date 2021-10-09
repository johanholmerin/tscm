const path = require('path');
const ts = require('typescript');

jest.mock('../typescript/lib/mapping/source-map', () => ({
  mapSourceMap: jest.fn(() => 'MAPPED_OUTPUT')
}));
const { mapSourceMap } = require('../typescript/lib/mapping/source-map');
beforeEach(() => {
  mapSourceMap.mockClear();
});

const { diagnostics } = require('../typescript/lib/shared');
const { compile, createHost, createProgram } = require('./utils/ts');
const { fixtures } = require('./utils/fixtures');

describe('typescript', () => {
  for (const file of fixtures) {
    it(path.parse(file).name, () => {
      const { code } = compile(path.join(file, 'input.ts'));
      expect(code).toMatchFile(path.join(file, 'typescript.ts'));
    });
  }

  it('adds errors to diagnostics when macro throws', () => {
    const fileName = path.join(__dirname, './fixtures/errors/throws/input.ts');
    compile(fileName);
    expect(diagnostics.get(fileName)).toEqual([
      {
        file: {
          fileName,
          text: `import { error } from './macros';

error!!();
`
        },
        start: 35,
        length: 9,
        messageText: 'Macro error error: test_message',
        category: 1,
        code: -1,
        reportsUnnecessary: {},
        reportsDeprecated: {}
      }
    ]);
  });

  it('maps output sourcemap', () => {
    const fileName = path.join(
      __dirname,
      './fixtures/transform/basic/input.ts'
    );

    const host = createHost();
    const writeFile = jest.fn((_fileName, content) => {
      expect(content).toEqual('MAPPED_OUTPUT');
    });
    host.writeFile = writeFile;
    const program = createProgram(fileName, host);
    program.emit();
    expect(writeFile).toHaveBeenCalled();
    expect(mapSourceMap).toHaveBeenCalled();
    expect(writeFile).toHaveBeenCalled();
  });

  it('adds errors to diagnostics when babel throws', () => {
    const fileName = path.join(
      __dirname,
      './fixtures/errors/invalid-syntax/input.ts'
    );
    compile(fileName);
    const diagnosticsList = diagnostics.get(fileName);
    expect(diagnosticsList).toHaveLength(1);
    const { file, ...diagnostic } = diagnosticsList[0];
    expect(file).toBeInstanceOf(ts.objectAllocator.getSourceFileConstructor());
    expect(diagnostic).toEqual({
      category: 1,
      code: -2,
      length: 0,
      messageText: 'Babel error: Unterminated string constant. (1:22)',
      reportsDeprecated: {},
      reportsUnnecessary: {},
      start: 22
    });
  });
});
