import { all, takeEvery, call, put, select } from 'redux-saga/effects';

import { CONTACT_ADDRESS_SELECTION } from './constants';
import { Contacts, CONTACTS_PREFIX } from 'lib/storage';

import {
  contactAddressRequest,
  contactAddressRequestSuccess,
  contactAddressRequestFailure,
} from './actions';

import { getDataForEmailSymbol } from './reducer';

async function fetchContact(email, symbol) {
  const address = await Contacts.getContactsWalletBySymbol(email, symbol);
  return address;
}

function* fetchContactFlow(action) {
  const { email, symbol } = action;

  try {
    const contact = yield select(state =>
      getDataForEmailSymbol(state.contacts, email, symbol)
    );

    if (!contact.address) {
      const address = yield call(fetchContact, email, symbol);

      yield put(contactAddressRequestSuccess(email, symbol, address));
    }
  } catch (error) {
    yield put(contactAddressRequestFailure(email, symbol, error));
  }
}

export default function* contactSagaWatcher() {
  yield takeEvery(CONTACT_ADDRESS_SELECTION, fetchContactFlow);
}
