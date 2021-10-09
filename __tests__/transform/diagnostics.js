const ts = require('typescript');
const { diagnostics, mappings } = require('../../typescript/lib/shared');
const {
  patchProgramDiagnostics
} = require('../../typescript/lib/transform/diagnostics');

const MAPPING = [
  [98, 128, 'Promise.resolve<{\n  id: string;\n}[]>([]);'],
  [0, 47, '                                               ']
];

const SOURCE = `import { sql, styles, validate } from './mods';

(() => {
  return 1;
})();

export const query = sql!!('SELECT id from items;');`;

describe('patchProgramDiagnostics', () => {
  const programMocks = {
    getSuggestionDiagnostics: jest.fn(),
    getSyntacticDiagnostics: jest.fn(),
    getSemanticDiagnostics: jest.fn()
  };
  const program = { ...programMocks };
  patchProgramDiagnostics(program);
  const sourceFile = ts.createSourceFile(
    'FAKE_FILE',
    SOURCE,
    ts.ScriptTarget.ESNext
  );
  const diagInReplacement = { start: 100, length: 10, file: sourceFile };
  const diagInSource = { start: 50, length: 5, file: sourceFile };
  const diagFromMacro = { start: 101, length: 2, file: sourceFile };

  beforeEach(() => {
    programMocks.getSuggestionDiagnostics.mockClear();
    programMocks.getSyntacticDiagnostics.mockClear();
    programMocks.getSemanticDiagnostics.mockClear();
  });

  function testDiagMethod(name, includeMacroDiag) {
    describe(name, () => {
      it('calls original function', () => {
        programMocks[name].mockReturnValue([]);

        program[name](sourceFile);

        expect(programMocks[name]).toHaveBeenCalledWith(sourceFile);
      });

      if (includeMacroDiag) {
        it('adds diagnostics', () => {
          diagnostics.set('FAKE_FILE', [diagFromMacro]);
          programMocks[name].mockReturnValue([]);

          const result = program[name](sourceFile);

          expect(result).toEqual([diagFromMacro]);
          expect(programMocks[name]).toHaveBeenCalledWith(sourceFile);
        });

        it('adds all diagnostics on no sourceFile input', () => {
          diagnostics.set('ANOTHER_FAKE_FILE', [diagFromMacro]);
          programMocks[name].mockReturnValue([]);

          const result = program[name]();

          expect(result).toEqual([diagFromMacro]);
          expect(programMocks[name]).toHaveBeenCalledWith();
        });
      } else {
        it("doesn't add diagnostics", () => {
          diagnostics.set('FAKE_FILE', [diagFromMacro]);
          programMocks[name].mockReturnValue([]);

          const result = program[name](sourceFile);

          expect(result).toEqual([]);
          expect(programMocks[name]).toHaveBeenCalledWith(sourceFile);
        });
      }

      it('filters out diagnostics in macro replacement', () => {
        mappings.set('FAKE_FILE', MAPPING);
        programMocks[name].mockReturnValue([diagInReplacement]);

        const result = program[name](sourceFile);

        expect(result).toEqual([]);
        expect(programMocks[name]).toHaveBeenCalledWith(sourceFile);
      });

      it('keeps diagnostics outside macro replacement', () => {
        mappings.set('FAKE_FILE', MAPPING);
        programMocks[name].mockReturnValue([diagInSource]);

        const result = program[name](sourceFile);

        expect(result).toEqual([diagInSource]);
        expect(programMocks[name]).toHaveBeenCalledWith(sourceFile);
      });
    });
  }

  testDiagMethod('getSuggestionDiagnostics', false);
  testDiagMethod('getSyntacticDiagnostics', true);
  testDiagMethod('getSemanticDiagnostics', true);
});
