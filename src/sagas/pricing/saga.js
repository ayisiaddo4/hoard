import { all, takeEvery, call, select, put } from 'redux-saga/effects';

import { getCurrencyPrice } from 'components/GetCurrencyPrice';
import { getCurrencyHistory } from 'components/GetCurrencyHistory';

import { SYMBOL_HOARD } from 'containers/App/constants';

import { tradingPairSelector } from 'screens/Settings/selectors';

import {
  GET_CURRENCY_HISTORY_REQUEST,
  GET_CURRENCY_PRICE_REQUEST,
} from './constants';
import {
  getCurrencyHistoryFailure,
  getCurrencyHistorySuccess,
  getCurrencyPriceFailure,
  getCurrencyPriceSuccess,
} from './actions';

const HOARD_BASE_PRICE = 0.035;

function* getCurrencyPriceFlow(action) {
  const { symbol } = action;
  try {
    const tradingPair = yield select(tradingPairSelector);
    let price;
    if (symbol === SYMBOL_HOARD) {
      price = HOARD_BASE_PRICE;
    } else {
      const payload = yield call(getCurrencyPrice, [symbol], tradingPair);
      price = payload[symbol][tradingPair];
    }

    yield put(getCurrencyPriceSuccess(symbol, price));
  } catch (error) {
    yield put(getCurrencyPriceFailure(symbol, [error]));
  }
}

function* getCurrencyHistoryFlow(action) {
  const { symbol } = action;
  try {
    const { limit, interval } = action;

    let data;
    let positive;
    let change;

    if (symbol === SYMBOL_HOARD) {
      data = [
        HOARD_BASE_PRICE,
        HOARD_BASE_PRICE,
        HOARD_BASE_PRICE,
        HOARD_BASE_PRICE,
        HOARD_BASE_PRICE,
        HOARD_BASE_PRICE,
        HOARD_BASE_PRICE,
        HOARD_BASE_PRICE,
      ];
      positive = true;
      change = '+0 (0%)';
    } else {
      const tradingPair = yield select(tradingPairSelector);
      data = yield call(
        getCurrencyHistory,
        symbol,
        tradingPair,
        limit,
        interval
      );
      const firstPrice = data[0];
      const firstNonZeroPrice = data[data.findIndex(v => v !== 0)];
      const lastPrice = data[data.length - 1];

      positive = firstPrice <= lastPrice;

      const changeAmount = lastPrice - firstPrice;
      const changePercentage = (changeAmount / firstNonZeroPrice) * 100;
      change = `${positive ? '+' : '-'}$${changeAmount.toFixed(2)}${
        changePercentage !== Infinity
          ? ` (${changePercentage.toFixed(2)}%)`
          : ''
      }`;
    }

    yield put(getCurrencyHistorySuccess(symbol, data, positive, change));
  } catch (error) {
    yield put(getCurrencyHistoryFailure(symbol, [error]));
  }
}

export default function* pricingSagaWatcher() {
  yield all([
    takeEvery(GET_CURRENCY_PRICE_REQUEST, getCurrencyPriceFlow),
    takeEvery(GET_CURRENCY_HISTORY_REQUEST, getCurrencyHistoryFlow),
  ]);
}
