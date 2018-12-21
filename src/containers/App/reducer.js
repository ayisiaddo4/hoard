import { INIT_REQUESTING, INIT_SUCCESS, INIT_ERROR } from './constants';

const initialState = {
  hasPreviouslyInitialized: false,
  requesting: false,
  successful: false,
  messages: [],
  errors: [],
  app: {},
};

export default function initReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_REQUESTING:
      return {
        hasPreviouslyInitialized: true,
        requesting: true,
        successful: false,
        messages: [],
        errors: [],
        app: {},
      };

    case INIT_SUCCESS:
      return {
        ...state,
        requesting: false,
        successful: true,
        messages: [],
        errors: [],
        app: { ...state.app, ...action.payload },
      };

    // Append any errors to the current state, if any.
    case INIT_ERROR:
      return {
        ...state,
        requesting: false,
        successful: false,
        messages: [],
        errors: [...state.errors, ...action.errors],
      };

    default:
      return state;
  }
}
