import Config from 'react-native-config';
import {
  all,
  select,
  takeLatest,
  takeEvery,
  call,
  put,
} from 'redux-saga/effects';
import { TYPE_SEND, TYPE_REQUEST } from 'screens/SendRequest/constants';
import {
  CANCEL_CONTACT_TRANSACTION_REQUESTING,
  CANCEL_CONTACT_TRANSACTION_SUCCESS,
  CANCEL_CONTACT_TRANSACTION_FAILURE,
  CONFIRM_CONTACT_TRANSACTION,
} from './constants';

import { WALLET_SEND_FUNDS_SUCCESS } from 'screens/Wallet/constants';

import { recordContactTransaction } from './actions';

import { INIT_USER } from 'containers/User/constants';
import { usernameSelector } from 'containers/User/selectors';

import api from 'lib/api';

export default function* contactTransactionsSagaWatcher() {
  yield all([
    takeLatest(INIT_USER, fetchContactTransactions),
    takeEvery(CANCEL_CONTACT_TRANSACTION_REQUESTING, cancelContactTransaction),
    takeEvery(WALLET_SEND_FUNDS_SUCCESS, checkForCompletedContactTransaction),
  ]);
}

export function* checkForCompletedContactTransaction(action) {
  if (action.transaction_uid) {
    const endpoint = `${
      Config.EREBOR_ENDPOINT
    }/contacts/transaction_confirmation/${action.transaction_uid}`;

    yield call(api.post, endpoint, {
      confirmed: true,
      transaction_hash: action.hash,
    });

    yield put({
      type: CONFIRM_CONTACT_TRANSACTION,
      transaction_uid: action.transaction_uid,
      transaction_hash: action.hash,
    });
  }
}
export function* fetchContactTransactions(action) {
  if (action.user && action.user.uid) {
    const endpoint = `${Config.EREBOR_ENDPOINT}/users/${
      action.user.uid
    }/contact_transactions`;
    try {
      const response = yield call(api.get, endpoint);
      if (response && response.length) {
        for (const transaction of response) {
          const username = yield select(state => usernameSelector(state));
          const type =
            transaction.transaction_type === 'send' ? TYPE_SEND : TYPE_REQUEST;
          const to = type === TYPE_SEND ? transaction.recipient : username;
          const from = type === TYPE_SEND ? username : transaction.recipient;
          yield put(
            recordContactTransaction({
              amount: transaction.amount,
              date: transaction.created * 1000,
              symbol: transaction.currency,
              type,
              to,
              from,
              details: transaction,
            })
          );
        }
      }
    } catch (e) {
      if (__DEV__) {
        console.log('contact oops', e, e.errors); // eslint-disable-line no-console
      }
    }
  }
}

export function* cancelContactTransaction(action) {
  try {
    const endpoint = `${
      Config.EREBOR_ENDPOINT
    }/contacts/transaction_confirmation/${action.transaction.details.uid}`;
    const response = yield call(api.post, endpoint, {
      confirmed: false,
      transaction_hash: null,
    });
    if (response.success) {
      yield put({
        type: CANCEL_CONTACT_TRANSACTION_SUCCESS,
        transaction: action.transaction,
      });
    } else {
      yield put({
        type: CANCEL_CONTACT_TRANSACTION_FAILURE,
        transaction: action.transaction,
      });
    }
  } catch (e) {
    if (__DEV__) {
      console.log('error cancelling contact transaction', e, e.errors); // eslint-disable-line no-console
    }

    yield put({
      type: CANCEL_CONTACT_TRANSACTION_FAILURE,
      transaction: action.transaction,
    });
  }
}
