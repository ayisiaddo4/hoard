import { ethers } from 'ethers';
import Config from 'react-native-config';
import { SYMBOL_ETH } from 'containers/App/constants';
import { all, select, takeEvery, call, put } from 'redux-saga/effects';
import {
  WALLET_IMPORT_SUCCESS,
  WALLET_TRACK_SYMBOL_SUCCESS,
  WALLET_UPDATE_BALANCE_SUCCESS,
} from 'screens/Wallet/constants';
import { getWalletInstance } from 'screens/Wallet/sagas';
import { transactionsForWalletSelector } from './selectors';
import { bigNumberToEther } from 'lib/formatters';
import { TYPE_SEND, TYPE_REQUEST } from 'screens/SendRequest/constants';

import { transactionFound, searchForTransactions } from './actions';
import {
  actionBridgeChannel,
  timestampPriceApi,
  asyncNextFrame,
} from './helpers';

import { getNetworkForCoin } from 'lib/currency-metadata';

import api from 'lib/api';

export const network = getNetworkForCoin(SYMBOL_ETH);
export const provider = ethers.getDefaultProvider(network);

export default function* ethTransactionsSagaWatcher() {
  yield all([
    takeEvery(
      [WALLET_IMPORT_SUCCESS, WALLET_TRACK_SYMBOL_SUCCESS],
      listenForWalletEvents
    ), // takes publicAddress, symbol
  ]);
}

export function* listenForWalletEvents(action) {
  const { symbol, publicAddress, id } = action.payload;

  if (symbol === SYMBOL_ETH) {
    provider.on(publicAddress, balance => {
      actionBridgeChannel.put({
        type: WALLET_UPDATE_BALANCE_SUCCESS,
        payload: {
          id,
          balance: Number(bigNumberToEther(balance).toString()),
        },
      });

      actionBridgeChannel.put(searchForTransactions(id));
    });

    yield put(searchForTransactions(id));
  }
}

// BLOCK SEARCH FUNCTIONS
export function* fetchHistoryEth({ id }) {
  const wallet = getWalletInstance(id);
  const publicAddress = yield call(wallet.getPublicAddress);

  try {
    const response = yield call(
      api.get,
      `${Config.BOMBADIL_ENDPOINT}/transactions/${publicAddress}`
    );
    const cachedTransactions = yield select(state =>
      transactionsForWalletSelector(state, SYMBOL_ETH, publicAddress)
    );
    for (const transaction of response.result.slice(
      cachedTransactions.length
    )) {
      yield call(asyncNextFrame);
      const isFrom =
        transaction.from.toLowerCase() === publicAddress.toLowerCase();
      const isTo = transaction.to.toLowerCase() === publicAddress.toLowerCase();

      const price = yield call(
        timestampPriceApi,
        SYMBOL_ETH,
        'USD',
        transaction.timestamp
      );

      const action = {
        type: isFrom ? TYPE_SEND : TYPE_REQUEST,
        date: Number(transaction.timestamp) * 1000,
        symbol: SYMBOL_ETH,
        from: isFrom ? publicAddress : transaction.from,
        to: isTo ? publicAddress : transaction.to,
        amount: transaction.ether,
        price: Number(transaction.ether) * price,
        fiatTrade: false,
        details: transaction,
      };

      yield put(transactionFound(action));
    }
  } catch (e) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('error encountered while fetching ETH transactions', e);
    }
  }
}
