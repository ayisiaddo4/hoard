import { makeQueryString } from '../index';

describe('Fetch makeQueryString helper', () => {
  it('should return an empty string with no queries', () => {
    expect(makeQueryString()).toEqual('');
    expect(makeQueryString([])).toEqual('');
  });
  it('should return a valid query string with any number of queries', () => {
    expect(makeQueryString([{ name: 'a', value: 1 }])).toEqual('?a=1');
    expect(
      makeQueryString([
        { name: 'a', value: 1 },
        { name: 'b', value: 'hey' },
        { name: 'c', value: 3 },
      ])
    ).toEqual('?a=1&b=hey&c=3');
  });
});
