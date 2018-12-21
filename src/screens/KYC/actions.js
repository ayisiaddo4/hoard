import {
  DOCUMENT_VERIFICATION_REQUESTING,
  INFO_VERIFICATION_CONFIRMATION,
} from './constants';

export const documentVerificationRequest = function documentVerificationRequest(
  user_credentials
) {
  return { type: DOCUMENT_VERIFICATION_REQUESTING, user_credentials };
};

export const infoVerificationConfirmation = function infoVerificationConfirmation(
  user_credentials
) {
  return { type: INFO_VERIFICATION_CONFIRMATION, user_credentials };
};
