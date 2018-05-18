import {
  all,
  takeEvery,
  call,
  put
} from 'redux-saga/effects';

import {getCurrencyPrice} from 'components/GetCurrencyPrice';
import {getCurrencyHistory} from 'components/GetCurrencyHistory';

import {
  SYMBOL_BOAR,
} from 'containers/App/constants';

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


function* getCurrencyPriceFlow(action) {
  const { symbol } = action;
  try {
    let price;
    if (symbol === SYMBOL_BOAR) {
      price = 0.46;
    } else {
      const payload = yield call(getCurrencyPrice, [symbol]);
      price = payload[symbol].USD;
    }

    yield put(getCurrencyPriceSuccess(
      symbol,
      price
    ));
  } catch (error) {
    yield put(getCurrencyPriceFailure(
      symbol,
      [error]
    ));
  }
}

function* getCurrencyHistoryFlow(action) {
  const { symbol } = action;
  try {
    const {limit, interval} = action;

    let data;
    let positive;
    let change;

    if (symbol === SYMBOL_BOAR) {
      data = [0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46];
      positive = true;
      change = '+0 (0%)';
    } else {
      data = yield call(getCurrencyHistory, symbol, limit, interval);
      const firstPrice = data[0];
      const firstNonZeroPrice = data[data.findIndex(v => v !== 0)];
      const lastPrice = data[data.length - 1];

      positive = firstPrice <= lastPrice;

      const changeAmount = lastPrice - firstPrice;
      const changePercentage = changeAmount / firstNonZeroPrice * 100;
      change = `${
        positive ? '+' : '-'
      }$${
        changeAmount.toFixed(2)
      }${
        changePercentage !== Infinity
        ? ` (${changePercentage.toFixed(2)}%)` : ''
      }`;
    }


    yield put(getCurrencyHistorySuccess(
      symbol,
      data,
      positive,
      change
    ));
  } catch (error) {
    yield put(getCurrencyHistoryFailure(
      symbol,
      [error]
    ));
  }
}

export default function* pricingSagaWatcher() {
  yield all([
    takeEvery(GET_CURRENCY_PRICE_REQUEST, getCurrencyPriceFlow),
    takeEvery(GET_CURRENCY_HISTORY_REQUEST, getCurrencyHistoryFlow),
  ]);
}
