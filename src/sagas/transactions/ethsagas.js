import ethers from 'ethers';
import Config from 'react-native-config';
import { SYMBOL_ETH } from 'containers/App/constants';
import { AsyncStorage } from 'react-native';
import { channel } from 'redux-saga';
import {
  fork,
  all,
  take,
  select,
  takeLatest,
  takeEvery,
  call,
  put,
} from 'redux-saga/effects';
import {
  WALLET_IMPORT_SUCCESS,
  WALLET_TRACK_SYMBOL_SUCCESS,
} from 'screens/Wallet/constants';
import { transactionsForWalletSelector } from './selectors';
import { asyncMemoize, Queue } from './helpers';
import { SEARCH_FOR_INTERESTING_BLOCKS } from './constants';
import { TYPE_SEND, TYPE_REQUEST } from 'screens/SendRequest/constants';

import { transactionFound, triggerSearchForInterestingBlocks } from './actions';

import { getNetworkForCoin } from 'lib/currency-metadata';

import api from 'lib/api';

export const network = ethers.providers.networks[getNetworkForCoin(SYMBOL_ETH)];
export const provider = ethers.providers.getDefaultProvider(network);

export const actionBridgeChannel = channel();
export let lastCheckedBlockNumber = {};
export let fetchingBlockNumber = false;
export let transactionsBlockQueue = new Queue();
export let searchInRangeList = [];

export const getTransaction = asyncMemoize(
  provider.getTransaction.bind(provider)
);
export const getTransactionCount = asyncMemoize(
  provider.getTransactionCount.bind(provider)
);
export const getBlock = asyncMemoize(provider.getBlock.bind(provider));
export const getBalance = asyncMemoize(provider.getBalance.bind(provider));

const cacheResponse = (url, response) =>
  AsyncStorage.setItem(
    `${HISTORICAL_PRICE_CACHE_KEY}:${url}`,
    JSON.stringify(response)
  );

const asyncDelay = number =>
  new Promise(resolve => setTimeout(() => resolve(), number));

const HISTORICAL_PRICE_CACHE_KEY = 'HISTORICAL_PRICE_CACHE';
export async function timestampPriceApi(symbol, fiat, timestamp) {
  const request = `?fsym=${symbol}&tsyms=${fiat}&ts=${timestamp}`;
  const storedValue = await AsyncStorage.getItem(
    `${HISTORICAL_PRICE_CACHE_KEY}:${request}`
  );

  const hasPrice = response => {
    return (
      !!response &&
      !!response[symbol] &&
      Object.keys(response[symbol]).includes(fiat)
    );
  };

  let parsedValue;
  if (storedValue) {
    parsedValue = JSON.parse(storedValue);
  }

  if (hasPrice(parsedValue)) {
    return parsedValue[symbol][fiat];
  }

  let retry = false;
  let attempts = 0;

  do {
    const response = await api.get(
      `${Config.EREBOR_ENDPOINT}/pricing_data/pricehistorical${request}`
    );

    if (hasPrice(response)) {
      await cacheResponse(request, response);
      return response[symbol][fiat];
    }

    if (response.status === 429 && attempts < 5) {
      retry = true;
      attempts++;
      await asyncDelay(1000 * attempts);
    } else {
      retry = false;
      await cacheResponse(request, response);
      throw new Error('Too Many Attempts To Retry Request');
    }
  } while (retry);
}

export default function* ethTransactionsSagaWatcher() {
  yield all([
    fork(setupActionBridgeChannel),
    takeEvery(
      [WALLET_IMPORT_SUCCESS, WALLET_TRACK_SYMBOL_SUCCESS],
      listenForWalletEvents
    ), // takes publicAddress, symbol
    takeLatest(SEARCH_FOR_INTERESTING_BLOCKS, fetchHistoryEth),
  ]);
}

export function* setupActionBridgeChannel() {
  while (true) {
    const action = yield take(actionBridgeChannel);
    yield put(action);
  }
}

export function* listenForWalletEvents(action) {
  const { symbol, publicAddress } = action.payload;

  if (symbol === SYMBOL_ETH) {
    yield fork(fetchHistoryEth, { publicAddress });

    provider.on(publicAddress, () => {
      actionBridgeChannel.put(triggerSearchForInterestingBlocks(publicAddress));
    });
  }
}

// BLOCK SEARCH FUNCTIONS
export function* fetchHistoryEth(action) {
  const { publicAddress } = action;

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
