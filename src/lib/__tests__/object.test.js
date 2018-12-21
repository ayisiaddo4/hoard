import { keyMapper } from '../object-helpers';

describe('test keyMapper', () => {
  it('should properly map keys', () => {
    const KEY_TO_OTHER_KEY = {
      // jumio to base
      a: 'A',
      b: 'B',
      c: 'C',
      d: 'D',
      e: 'E',
      f: 'F',

      // base to complyadvantage
      A: 'g',
      B: 'h',
      C: 'i',
      D: 'j',
      E: 'k',
      F: 'l',
    };

    const testResponse = {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
      f: 6,
      hullaballoo: 7,
    };

    const expectedResult = {
      A: 1,
      B: 2,
      C: 3,
      D: 4,
      E: 5,
      F: 6,
      hullaballoo: 7,
    };

    const complyAdvantageRequest = {
      g: 1,
      h: 2,
      i: 3,
      j: 4,
      k: 5,
      l: 6,
      hullaballoo: 7,
    };

    expect(keyMapper(testResponse, KEY_TO_OTHER_KEY)).toEqual(expectedResult);
    expect(keyMapper(expectedResult, KEY_TO_OTHER_KEY)).toEqual(
      complyAdvantageRequest
    );
  });
});
