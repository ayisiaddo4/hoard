import {
  GET_CURRENCY_HISTORY_REQUEST,
  GET_CURRENCY_HISTORY_SUCCESS,
  GET_CURRENCY_HISTORY_FAILURE,
  GET_CURRENCY_PRICE_REQUEST,
  GET_CURRENCY_PRICE_SUCCESS,
  GET_CURRENCY_PRICE_FAILURE,
} from './constants';

import { INIT_SUPPORTED_COINS } from 'containers/App/constants';

const initializeSymbolState = () => ({
  price: {
    requesting: true,
    successful: false,
    errors: [],
    price: null,
  },
  history: {
    requesting: true,
    successful: false,
    errors: [],
    interval: null,
    limit: null,
    data: [],
    positive: null,
    change: null,
  },
});

const initialState = {
  initialized: false,
  /*
  <symbol>: {
    price: {
      requesting: bool,
      successful: bool,
      errors: string[],
      price: number,
      positive: bool,
      change: string
    }
    history: {
      requesting: bool,
      successful: bool,
      errors: string[],
      interval: string,
      limit: number,
      data: number[]
    }
  }
*/
};

export default function reducer(state = initialState, action) {
  const { symbol } = action;

  switch (action.type) {
    case INIT_SUPPORTED_COINS: {
      const newState = {};
      action.coins.map(coin => (newState[coin] = initializeSymbolState()));

      return {
        ...state,
        ...newState,
        initialized: true,
      };
    }
    case GET_CURRENCY_PRICE_REQUEST: {
      const symbolState = state[symbol] || initializeSymbolState();
      return {
        ...state,
        [symbol]: {
          ...symbolState,
          price: {
            ...symbolState.price,
            requesting: true,
          },
        },
      };
    }
    case GET_CURRENCY_PRICE_SUCCESS: {
      return {
        ...state,
        [symbol]: {
          ...state[symbol],
          price: {
            ...state[symbol].price,
            requesting: false,
            successful: true,
            price: action.price,
            errors: [],
          },
        },
      };
    }
    case GET_CURRENCY_PRICE_FAILURE: {
      return {
        ...state,
        [symbol]: {
          ...state[symbol],
          price: {
            ...state[symbol].price,
            requesting: false,
            successful: false,
            errors: action.errors,
          },
        },
      };
    }
    case GET_CURRENCY_HISTORY_REQUEST: {
      const symbolState = state[symbol] || initializeSymbolState();
      return {
        ...state,
        [symbol]: {
          ...symbolState,
          history: {
            ...symbolState.history,
            requesting: true,
            interval: action.interval,
            limit: action.limit,
          },
        },
      };
    }
    case GET_CURRENCY_HISTORY_SUCCESS: {
      return {
        ...state,
        [symbol]: {
          ...state[symbol],
          history: {
            ...state[symbol].history,
            requesting: false,
            successful: true,
            data: action.data,
            positive: action.positive,
            change: action.change,
            errors: [],
          },
        },
      };
    }
    case GET_CURRENCY_HISTORY_FAILURE: {
      return {
        ...state,
        [symbol]: {
          ...state[symbol],
          history: {
            ...state[symbol].history,
            requesting: false,
            successful: false,
            errors: action.errors,
          },
        },
      };
    }
    default:
      return state;
  }
}
