/* eslint no-undef: 0 */

import reducer from '../reducer';
import { SIGNUP_REQUESTING, SIGNUP_SUCCESS, SIGNUP_ERROR } from '../constants';

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

  it('should handle SIGNUP_REQUESTING', () => {
    expect(
      reducer(defaultInitialState, {
        type: SIGNUP_REQUESTING,
      })
    ).toEqual({
      requesting: true,
      successful: false,
      messages: [],
      errors: [],
    });
  });

  it('should handle SIGNUP_SUCCESS', () => {
    expect(
      reducer(defaultInitialState, {
        type: SIGNUP_SUCCESS,
      })
    ).toEqual({
      errors: [],
      messages: [],
      requesting: false,
      successful: true,
    });
  });

  it('should handle SIGNUP_ERROR', () => {
    expect(
      reducer(defaultInitialState, {
        type: SIGNUP_ERROR,
        error: 'a sample error',
      })
    ).toEqual({
      errors: [
        {
          body: 'a sample error',
        },
      ],
      messages: [],
      requesting: false,
      successful: false,
    });
  });
});
