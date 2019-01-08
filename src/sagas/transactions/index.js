import {
  INIT_REQUESTING,
  SYMBOL_BTC,
  SYMBOL_ETH,
  SYMBOL_HOARD,
  SYMBOL_RVN,
} from 'containers/App/constants';
import { AsyncStorage } from 'react-native';
import {
  throttle,
  fork,
  all,
  put,
  takeLatest,
  select,
  takeEvery,
  call,
} from 'redux-saga/effects';
import {
  HYDRATE_TRANSACTIONS,
  TRANSACTION_FOUND,
  SEARCH_FOR_TRANSACTIONS,
  TRANSACTION_UPDATE,
  RECORD_CONTACT_TRANSACTION,
  CANCEL_CONTACT_TRANSACTION_SUCCESS,
  TRANSACTIONS_STORAGE_KEY,
} from './constants';
import { transactionFound } from './actions';
import ethSagas, { fetchHistoryEth } from './ethsagas';
import btcSagas, { fetchHistoryBTC } from './btcsagas';
import contactSagas from './contactsagas';
import { fetchHistoryBoar, LAST_HOARD_BLOCK_STORAGE_KEY } from './boarsagas';
import { walletSelector } from 'screens/Wallet/selectors';

export default function* transactionSagaWatcher() {
  yield all([
    takeLatest(INIT_REQUESTING, initialize),
    takeEvery(SEARCH_FOR_TRANSACTIONS, fetchHistory),
    throttle(1000, TRANSACTION_FOUND, forwardActionToSaveTransactions),
    throttle(1000, RECORD_CONTACT_TRANSACTION, forwardActionToSaveTransactions),
    throttle(
      1000,
      CANCEL_CONTACT_TRANSACTION_SUCCESS,
      forwardActionToSaveTransactions
    ),
    throttle(1000, TRANSACTION_UPDATE, forwardActionToSaveTransactions),
  ]);
}

export function* initialize() {
  yield fork(ethSagas);
  yield fork(btcSagas);
  yield fork(contactSagas);

  yield call(hydrate);
}

export function* hydrate() {
  const savedState = yield call(AsyncStorage.getItem, TRANSACTIONS_STORAGE_KEY);

  let state;
  if (savedState) {
    try {
      state = JSON.parse(savedState);
    } catch (e) {
      state = null;
    }
  }

  if (state) {
    const currentVersion = yield select(state => state.transactions.version);
    if (state.version !== currentVersion) {
      state = null;
      yield call(AsyncStorage.removeItem, LAST_HOARD_BLOCK_STORAGE_KEY);
    }
  }

  yield put({
    type: HYDRATE_TRANSACTIONS,
    state,
  });
}

export function* forwardActionToSaveTransactions(action) {
  if (!action.doNotSave) {
    yield call(saveTransactions);
  }
}

export function* saveTransactions() {
  const transactions = yield select(state => state.transactions);

  yield call(
    AsyncStorage.setItem,
    TRANSACTIONS_STORAGE_KEY,
    JSON.stringify(transactions)
  );
}

export function* fetchHistory(action) {
  const receivedWallet = yield select(state =>
    walletSelector(state, action.id)
  );
  const wallet = receivedWallet ? receivedWallet : {};

  switch (wallet.symbol) {
    case SYMBOL_ETH: {
      yield call(fetchHistoryEth, action);
      return;
    }
    case SYMBOL_RVN:
    case SYMBOL_BTC: {
      yield call(fetchHistoryBTC, action);
      return;
    }
    case SYMBOL_HOARD: {
      yield call(fetchHistoryBoar, action);
      return;
    }
    default: {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log(
          'unable to fetch transaction history for wallet: ',
          action.address
        );
      }
    }
  }
}
