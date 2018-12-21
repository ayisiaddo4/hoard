import {
  CONTACT_ADDRESS_SELECTION,
  CONTACT_ADDRESS_REQUESTING,
  CONTACT_ADDRESS_SUCCESS,
  CONTACT_ADDRESS_FAILURE,
} from './constants';

export function selectContact(email, symbol) {
  return {
    type: CONTACT_ADDRESS_SELECTION,
    email,
    symbol,
  };
}

export function contactAddressRequest(email, symbol) {
  return {
    type: CONTACT_ADDRESS_REQUESTING,
    email,
    symbol,
  };
}

export function contactAddressRequestSuccess(email, symbol, address) {
  return {
    type: CONTACT_ADDRESS_SUCCESS,
    email,
    symbol,
    address,
  };
}

export function contactAddressRequestFailure(email, symbol, errors) {
  return {
    type: CONTACT_ADDRESS_FAILURE,
    email,
    symbol,
    errors,
  };
}
