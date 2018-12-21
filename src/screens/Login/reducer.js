import { LOGIN_REQUESTING, LOGIN_SUCCESS, LOGIN_ERROR } from './constants';

const initialState = {
  requesting: false,
  successful: false,
  messages: [],
  error: null,
};

export default function loginReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_REQUESTING:
      return { requesting: true, successful: false, messages: [], error: null };

    case LOGIN_SUCCESS:
      return {
        ...state,
        requesting: false,
        successful: true,
        messages: [],
        error: null,
      };

    // Append any errors to the current state, if any.
    case LOGIN_ERROR:
      return {
        ...state,
        requesting: false,
        successful: false,
        messages: [],
        error: action.error,
      };

    default:
      return state;
  }
}
