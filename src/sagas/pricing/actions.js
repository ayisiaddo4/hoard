import {
  GET_CURRENCY_HISTORY_REQUEST,
  GET_CURRENCY_HISTORY_SUCCESS,
  GET_CURRENCY_HISTORY_FAILURE,
  GET_CURRENCY_PRICE_REQUEST,
  GET_CURRENCY_PRICE_SUCCESS,
  GET_CURRENCY_PRICE_FAILURE,
} from './constants';

export function getCurrencyPrice(symbol) {
  return {
    type: GET_CURRENCY_PRICE_REQUEST,
    symbol,
  };
}

export function getCurrencyPriceSuccess(symbol, price) {
  return {
    type: GET_CURRENCY_PRICE_SUCCESS,
    symbol,
    price,
  };
}

export function getCurrencyPriceFailure(symbol, errors) {
  return {
    type: GET_CURRENCY_PRICE_FAILURE,
    symbol,
    errors,
  };
}

export function getCurrencyHistory(symbol, options = {}) {
  const { limit, interval } = options;

  return {
    type: GET_CURRENCY_HISTORY_REQUEST,
    symbol,
    limit,
    interval,
  };
}

export function getCurrencyHistorySuccess(symbol, data, positive, change) {
  return {
    type: GET_CURRENCY_HISTORY_SUCCESS,
    symbol,
    positive,
    change,
    data,
  };
}

export function getCurrencyHistoryFailure(symbol, errors) {
  return {
    type: GET_CURRENCY_HISTORY_FAILURE,
    symbol,
    errors,
  };
}
