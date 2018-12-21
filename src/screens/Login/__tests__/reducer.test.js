/* eslint no-undef: 0 */

import reducer from '../reducer';
import { LOGIN_REQUESTING, LOGIN_SUCCESS, LOGIN_ERROR } from '../constants';

const defaultInitialState = {
  requesting: false,
  successful: false,
  messages: [],
  errors: [],
};

describe('Login Reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(defaultInitialState);
  });

  it('should handle LOGIN_REQUESTING', () => {
    expect(
      reducer(defaultInitialState, {
        type: LOGIN_REQUESTING,
      })
    ).toEqual({
      requesting: true,
      successful: false,
      messages: [],
      errors: [],
    });
  });

  it('should handle LOGIN_SUCCESS', () => {
    expect(
      reducer(defaultInitialState, {
        type: LOGIN_SUCCESS,
      })
    ).toEqual({
      requesting: false,
      successful: true,
      messages: [],
      errors: [],
    });
  });

  it('should handle LOGIN_ERROR', () => {
    expect(
      reducer(defaultInitialState, {
        type: LOGIN_ERROR,
        errors: ['a sample error', 'another error'],
      })
    ).toEqual({
      requesting: false,
      successful: false,
      messages: [],
      errors: ['a sample error', 'another error'],
    });
  });
});
