const {
  translatePosForward,
  translatePosBackward
} = require('../../typescript/lib/mapping/position');

const MAPPING = [
  [98, 128, 'Promise.resolve<{\n  id: string;\n}[]>([]);'],
  [149, 177, '[]'],
  [204, 233, 'Promise.resolve<{\n  foo: string;\n}[]>([]);'],
  [0, 47, '                                               ']
];

const NESTED_MAPPING = [
  [82, 97, '"string value: val"'],
  [64, 101, '[{\n  prop: "string value: val"\n}]'],
  [0, 41, '                                         ']
];

describe('translatePosForward', () => {
  it('returns input on no mappings', () => {
    expect(translatePosForward([], 10)).toEqual(10);
  });

  it('returns input outside source', () => {
    expect(translatePosForward([], 117)).toEqual(117);
  });

  it('maps after replacement of same length', () => {
    expect(translatePosForward(MAPPING, 91)).toEqual(91);
  });

  it('maps after multi-line replacement', () => {
    expect(translatePosForward(MAPPING, 144)).toEqual(155);
  });

  it('maps after multi-line replacement2', () => {
    expect(translatePosForward(MAPPING, 193)).toEqual(178);
  });

  it('returns -1 in replacement', () => {
    expect(translatePosForward(MAPPING, 102)).toEqual(-1);
  });

  it('supports nested macros', () => {
    expect(translatePosForward(NESTED_MAPPING, 118)).toEqual(114);
  });
});

describe('translatePosBackward', () => {
  it('returns input on no mappings', () => {
    expect(translatePosBackward([], 10)).toEqual(10);
  });

  it('returns input outside source', () => {
    expect(translatePosBackward([], 117)).toEqual(117);
  });

  it('maps after replacement of same length', () => {
    expect(translatePosBackward(MAPPING, 91)).toEqual(91);
  });

  it('maps after multi-line replacement', () => {
    expect(translatePosBackward(MAPPING, 155)).toEqual(144);
  });

  it('maps after multi-line replacement2', () => {
    expect(translatePosBackward(MAPPING, 178)).toEqual(193);
  });

  it('supports nested macros', () => {
    expect(translatePosBackward(NESTED_MAPPING, 114)).toEqual(118);
  });
});
