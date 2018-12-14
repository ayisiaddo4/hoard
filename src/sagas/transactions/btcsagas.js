import { TRANSACTION_FOUND } from './constants';
import { WALLET_TRACK_SYMBOL_SUCCESS } from 'screens/Wallet/constants';
import { SYMBOL_BTC } from 'containers/App/constants';
import { fork, all, takeEvery, call, put } from 'redux-saga/effects';
import { TYPE_SEND, TYPE_REQUEST } from 'screens/SendRequest/constants';

import { timestampPriceApi } from './ethsagas';
import Config from 'react-native-config';
var Reactotron = require('src/ReactotronConfig').default;
import api from 'lib/api';

export default function* btcTransactionsSagaWatcher() {
  yield all([takeEvery(WALLET_TRACK_SYMBOL_SUCCESS, fetchTransactions)]);
}

export function* fetchPage(action, pageNum) {
  const bench = Reactotron.benchmark('Fetching Bitcoin page');
  bench.step('Start');

  try {
    const endpoint = `${Config.BTC_NODE_ENDPOINT}/txs?address=${
      action.payload.publicAddress
    }&pageNum=${pageNum}`;
    const response = yield api.get(endpoint);

    const nextPage = pageNum + 1;
    if (nextPage < response.pagesTotal) {
      yield fork(fetchPage, action, nextPage);
    }
    bench.step('Starting loop of transactions... ');

    for (let transaction of response.txs) {
      bench.step('Loop: transaction found ... ');

      const inAddresses = transaction.vin.map(vin => vin.addr);
      bench.step('Loop: was send? ... ');

      const wasSend = inAddresses.includes(action.payload.publicAddress);

      let from;
      let to;
      let amount;

      if (wasSend) {
        bench.step('Transaction was a send...');
        from = action.payload.publicAddress;
        bench.step('Loop: firstOtherVout? ');
        const firstOtherVout = transaction.vout.find(
          vout =>
            vout.scriptPubKey.addresses[0] !== action.payload.publicAddress
        );

        if (firstOtherVout) {
          bench.step('Loop: firstOtherVout ');
          to = firstOtherVout.scriptPubKey.addresses[0];
          amount = Number(firstOtherVout.value);
        } else {
          bench.step('Loop: !firstOtherVout ');

          // for some reason this was a send to yourself, but we should still show it
          to = action.payload.publicAddress;
          bench.step('Loop: !firstOtherVout reduce ');

          amount = transaction.vout.reduce(
            (total, vout) => total + Number(vout.value),
            0
          );
        }
      } else {
        bench.step('Loop: not a send... ');

        from = inAddresses[0];
        to = action.payload.publicAddress;

        const firstMyVout = transaction.vout.find(
          vout =>
            vout.scriptPubKey.addresses[0] === action.payload.publicAddress
        );
        amount = Number(firstMyVout.value);
      }
      bench.step('Loop: calling timestampPriceApi... ');

      const price = yield call(
        timestampPriceApi,
        SYMBOL_BTC,
        'USD',
        transaction.time
      );
      bench.step('Loop: putting TRANSACTION_FOUND');
      yield put({
        type: TRANSACTION_FOUND,
        transaction: {
          type: wasSend ? TYPE_SEND : TYPE_REQUEST,
          date: transaction.time * 1000,
          symbol: SYMBOL_BTC,
          from,
          to,
          amount,
          price: amount * price,
          fiatTrade: false,
          details: {
            ...transaction,
            hash: transaction.txid,
          },
        },
      });
    }
  } catch (e) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('An error occurred while fetching BTC transacions: ', e);
    }
  }
  bench.stop('Stop');
}
export function* fetchTransactions(action) {
  if (action.payload.symbol === SYMBOL_BTC) {
    yield call(fetchPage, action, 0);
  }
}
