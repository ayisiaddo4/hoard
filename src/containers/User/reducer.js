import { INIT_USER, UPDATE_USER, CLEAR_USER } from './constants';

const initialState = {
  requesting: false,
  successful: false,
  messages: [],
  errors: [],
  user: {},
};

export default function initReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_USER:
    case UPDATE_USER:
      return {
        ...state,
        requesting: false,
        successful: true,
        messages: [],
        errors: [],
        user: { ...state.user, ...action.user },
      };
    case CLEAR_USER:
      return {
        ...state,
        requesting: false,
        successful: true,
        messages: [],
        errors: [],
        user: {},
      };

    default:
      return state;
  }
}
