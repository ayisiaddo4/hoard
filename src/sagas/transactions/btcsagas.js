import { transactionFound, searchForTransactions } from './actions';
import { WALLET_TRACK_SYMBOL_SUCCESS } from 'screens/Wallet/constants';
import { updateBalance } from 'screens/Wallet/actions';
import { SYMBOL_BTC, SYMBOL_RVN } from 'containers/App/constants';
import { fork, all, takeEvery, call, put, select } from 'redux-saga/effects';
import { TYPE_SEND, TYPE_REQUEST } from 'screens/SendRequest/constants';
import { getWalletInstance } from 'screens/Wallet/sagas';

import { blockchainTransactionSelector } from './selectors';

import {
  timestampPriceApi,
  actionBridgeChannel,
  asyncNextFrame,
} from './helpers';
import { config as BtcConfig } from 'screens/Wallet/WalletInstances/BtcWallet';
import { config as RvnConfig } from 'screens/Wallet/WalletInstances/RvnWallet';

import api from 'lib/api';

const configForCoin = {
  [SYMBOL_RVN]: RvnConfig,
  [SYMBOL_BTC]: BtcConfig,
};

export default function* btcTransactionsSagaWatcher() {
  yield all([takeEvery(WALLET_TRACK_SYMBOL_SUCCESS, initializeWallet)]);
}

const POLLING_INTERVAL = 1000 * 60 * 2;

export function* initializeWallet(action) {
  const { symbol, id } = action.payload;
  if (symbol === SYMBOL_BTC || symbol === SYMBOL_RVN) {
    const keepPolling = () =>
      setTimeout(() => {
        actionBridgeChannel.put(updateBalance(id));
        actionBridgeChannel.put(searchForTransactions(id));
        keepPolling();
      }, POLLING_INTERVAL);
    keepPolling();
    yield put(searchForTransactions(id));
  }
}

export function* fetchTransaction(wallet, transaction) {
  const txFound = yield select(state =>
    blockchainTransactionSelector(state, wallet.symbol, transaction.txid)
  );

  if (txFound) {
    return;
  }

  yield call(asyncNextFrame);

  try {
    const inAddresses = transaction.vin.map(vin => vin.addr);
    const wasSend = inAddresses.includes(wallet.publicAddress);

    let from;
    let to;
    let amount;

    if (wasSend) {
      from = wallet.publicAddress;
      const firstOtherVout = transaction.vout.find(
        vout => vout.scriptPubKey.addresses[0] !== wallet.publicAddress
      );

      if (firstOtherVout) {
        to = firstOtherVout.scriptPubKey.addresses[0];
        amount = Number(firstOtherVout.value);
      } else {
        // for some reason this was a send to yourself, but we should still show it
        to = wallet.publicAddress;
        amount = transaction.vout.reduce(
          (total, vout) => total + Number(vout.value),
          0
        );
      }
    } else {
      from = inAddresses[0];
      to = wallet.publicAddress;
      const firstMyVout = transaction.vout.find(
        vout => vout.scriptPubKey.addresses[0] === wallet.publicAddress
      );
      amount = Number(firstMyVout.value);
    }

    const price = yield call(
      timestampPriceApi,
      wallet.symbol,
      'USD',
      transaction.time
    );

    yield put(
      transactionFound({
        type: wasSend ? TYPE_SEND : TYPE_REQUEST,
        date: transaction.time * 1000,
        symbol: wallet.symbol,
        from,
        to,
        amount,
        price: amount * price,
        fiatTrade: false,
        details: {
          ...transaction,
          hash: transaction.txid,
        },
      })
    );
  } catch (e) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log(
        `An error occurred while fetching BTC transaction ${
          transaction.txid
        }: `,
        e
      );
    }
  }
}

export function* fetchPage(wallet, pageNum) {
  try {
    const config = configForCoin[wallet.symbol];
    const endpoint = `${config.endpoint}/txs?address=${
      wallet.publicAddress
    }&pageNum=${pageNum}`;
    const response = yield api.get(endpoint);

    const nextPage = pageNum + 1;
    if (nextPage < response.pagesTotal) {
      yield fork(fetchPage, wallet, nextPage);
    }

    yield all(
      response.txs.map(transaction =>
        call(fetchTransaction, wallet, transaction)
      )
    );
  } catch (e) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('An error occurred while fetching BTC transacions: ', e);
    }
  }
}

export function* fetchHistoryBTC({ id }) {
  const wallet = getWalletInstance(id);
  const symbol = wallet.symbol;
  const publicAddress = yield call(wallet.getPublicAddress);
  yield call(fetchPage, { symbol, publicAddress }, 0);
}
