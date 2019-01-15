import { AsyncStorage } from 'react-native';
import { channel } from 'redux-saga';
import api from 'lib/api';
import Config from 'react-native-config';

const HISTORICAL_PRICE_CACHE_KEY = 'HISTORICAL_PRICE_CACHE';

const cacheResponse = (url, response) =>
  AsyncStorage.setItem(
    `${HISTORICAL_PRICE_CACHE_KEY}:${url}`,
    JSON.stringify(response)
  );

const asyncDelay = number =>
  new Promise(resolve => setTimeout(() => resolve(), number));

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

  let parsedValue; // eslint-disable-line immutable/no-let
  if (storedValue) {
    parsedValue = JSON.parse(storedValue);
  }

  if (hasPrice(parsedValue)) {
    return parsedValue[symbol][fiat];
  }

  let retry = false; // eslint-disable-line immutable/no-let
  let attempts = 0; // eslint-disable-line immutable/no-let

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

export const actionBridgeChannel = channel();
