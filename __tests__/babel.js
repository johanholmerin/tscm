const path = require('path');
const { compile, compileString } = require('./utils/babel');
const { fixtures } = require('./utils/fixtures');

describe('babel', () => {
  for (const file of fixtures) {
    it(path.parse(file).name, () => {
      const { code } = compile(path.join(file, 'input.ts'));
      expect(code).toMatchFile(path.join(file, 'babel.ts'));
    });
  }

  it('reports error when macro throws', () => {
    expect(() =>
      compile(path.join(__dirname, './fixtures/errors/throws/input.ts'))
    ).toThrowErrorMatchingInlineSnapshot(`
      "Macro error error: test_message
        1 | import { error } from './macros';
        2 |
      > 3 | error!!();
          | ^^^^^^^^^
        4 |"
    `);
  });

  it("reports error when macro file doesn't exist", () => {
    expect(() =>
      compile(path.join(__dirname, './fixtures/errors/wrong-path/input.ts'))
    ).toThrowErrorMatchingInlineSnapshot(`
      "Macro error error: Cannot find module './macros'
      > 1 | import { error } from './macros';
          | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        2 |
        3 | error!!();
        4 |"
    `);
  });

  it("reports error when macro name doesn't exist", () => {
    expect(() =>
      compile(path.join(__dirname, './fixtures/errors/wrong-name/input.ts'))
    ).toThrowErrorMatchingInlineSnapshot(`
      "Macro err error: Function err does not exist in './macros'
      > 1 | import { err } from './macros';
          | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        2 |
        3 | err!!();
        4 |"
    `);
  });

  it("doesn't transform non-macro code", () => {
    const INPUT = `foo!();`;
    expect(compileString(INPUT).code).toEqual(INPUT);
  });

  it("doesn't transform macro without import", () => {
    const INPUT = `foo!!();`;
    expect(compileString(INPUT).code).toEqual(INPUT);
  });

  it("doesn't transform non-import reference", () => {
    const INPUT = `const foo = () => {};

foo!!();`;
    expect(compileString(INPUT).code).toEqual(INPUT);
  });
});
