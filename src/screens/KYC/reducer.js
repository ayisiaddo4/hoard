import {
  DOCUMENT_VERIFICATION_REQUESTING,
  DOCUMENT_VERIFICATION_SUCCESS,
  DOCUMENT_VERIFICATION_ERROR,
  DOCUMENT_VERIFICATION_RETRY,
  INFO_VERIFICATION_CONFIRMATION,
} from './constants';

const initialState = {
  documentVerificationCompleted: false,
  infoVerificationCompleted: false,
  amlCompleted: false,
  requesting: false,
  successful: false,
  authorized: false,
  user_information: {},
  messages: [],
  errors: [],
};

export default function kycStatusReducer(state = initialState, action) {
  switch (action.type) {
    case DOCUMENT_VERIFICATION_REQUESTING:
      return {
        documentVerificationCompleted: false,
        infoVerificationCompleted: false,
        amlCompleted: false,
        requesting: true,
        successful: false,
        authorized: false,
        user_information: {},
        messages: [],
        errors: [],
      };

    case DOCUMENT_VERIFICATION_SUCCESS:
      return {
        ...state,
        documentVerificationCompleted: true,
        infoVerificationCompleted: false,
        amlCompleted: false,
        requesting: false,
        successful: true,
        authorized: action.authorized,
        user_information: action.user_information,
        messages: [],
        errors: [],
      };

    // Append any errors to the current state, if any.
    case DOCUMENT_VERIFICATION_ERROR:
      return {
        ...state,
        documentVerificationCompleted: true,
        infoVerificationCompleted: false,
        amlCompleted: false,
        requesting: false,
        successful: false,
        authorized: false,
        user_information: {},
        messages: [],
        errors: [...state.errors, ...action.errors],
      };

    // Append any errors to the current state, if any.
    case DOCUMENT_VERIFICATION_RETRY:
      return {
        ...state,
        documentVerificationCompleted: false,
        infoVerificationCompleted: false,
        amlCompleted: false,
        requesting: true,
        successful: false,
        authorized: false,
        user_information: {},
        messages: [],
        errors: [],
      };
    case INFO_VERIFICATION_CONFIRMATION:
      return {
        ...state,
        infoVerificationCompleted: true,
      };
    default:
      return state;
  }
}
