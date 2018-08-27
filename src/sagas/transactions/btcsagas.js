import Bitcoin from 'bitcoinjs-lib';
import {TRANSACTION_FOUND} from './constants';
import { WALLET_IMPORT_SUCCESS, WALLET_TRACK_SYMBOL_SUCCESS } from "screens/Wallet/constants";
import { SYMBOL_BTC } from "containers/App/constants";
import { fork, all, take, select, takeEvery, call, put } from "redux-saga/effects";
import { TYPE_SEND, TYPE_REQUEST } from 'screens/SendRequest/constants';

import {BTCNodeRequest} from 'screens/Wallet/WalletInstances/BtcWallet';
import {timestampPriceApi} from './ethsagas';
import TxDecoder from './btc-tx-decoder';
import Config from 'react-native-config';

import api from 'lib/api';

export default function* btcTransactionsSagaWatcher() {
  yield all([
    takeEvery(WALLET_TRACK_SYMBOL_SUCCESS, fetchTransactions),
  ]);
}

export function* fetchTransactions(action) {
  if (action.payload.symbol === SYMBOL_BTC) {
    try {
      const endpoint = `${Config.BTC_NODE_ENDPOINT}/txs?address=${action.payload.publicAddress}`;
      const response = yield api.get(endpoint);

      for (let transaction of response.txs) {
        const inAddresses = transaction.vin.map(vin => vin.addr);
        const wasSend = inAddresses.includes(action.payload.publicAddress);

        let from;
        let to;
        let amount;

        if (wasSend) {
          from = action.payload.publicAddress;
          const firstOtherVout = transaction
            .vout
            .find(vout => vout.scriptPubKey.addresses[0] !== action.payload.publicAddress);

          if (firstOtherVout) {
            to = firstOtherVout.scriptPubKey.addresses[0];
            amount = Number(firstOtherVout.value);
          } else { // for some reason this was a send to yourself, but we should still show it
            to = action.payload.publicAddress;
            amount = transaction.vout.reduce((total, vout) => total + Number(vout.value), 0);
          }
        } else {
          from = inAddresses[0];
          to = action.payload.publicAddress;
          const firstMyVout = transaction
                .vout
                .find(vout => vout.scriptPubKey.addresses[0] === action.payload.publicAddress);
          amount = Number(firstMyVout.value);
        }

        const price = yield call(timestampPriceApi, `?fsym=BTC&tsyms=USD&ts=${transaction.time}`);

        yield put({
          type: TRANSACTION_FOUND,
          transaction: {
            type: wasSend ? TYPE_SEND : TYPE_REQUEST,
            date: transaction.time * 1000,
            symbol: SYMBOL_BTC,
            from,
            to,
            amount,
            price: amount * price.BTC.USD,
            fiatTrade: false,
            details: {
              ...transaction,
              hash: transaction.txid
            }
          }
        });
      }
    } catch(e) {
      if (__DEV__) {
        console.log('An error occurred while fetching BTC transacions: ', e);
      }
    }
  }
}
