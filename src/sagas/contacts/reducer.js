import {
  CONTACT_ADDRESS_REQUESTING,
  CONTACT_ADDRESS_SUCCESS,
  CONTACT_ADDRESS_FAILURE,
} from './constants';

const initialSymbolState = {
  address: null,
  requesting: false,
  successful: false,
  errors: [],
};

const initialContactState = {
  // <symbol>: <initialSymbolState>
};

const initialState = {
  // <email>: <initialContactState>
};

export const getDataForEmailSymbol = (state, email, symbol) => {
  const contactState = state[email] || initialContactState;
  const symbolState = contactState[symbol] || initialSymbolState;

  return symbolState;
};

const setDataForEmailSymbol = (state, email, symbol, data) => {
  const contactState = state[email] || initialContactState;
  const symbolState = contactState[symbol] || initialSymbolState;

  return {
    ...state,
    [email]: {
      ...contactState,
      [symbol]: {
        ...symbolState,
        ...data,
      },
    },
  };
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CONTACT_ADDRESS_REQUESTING: {
      return setDataForEmailSymbol(state, action.email, action.symbol, {
        requesting: true,
        successful: false,
        errors: [],
      });
    }
    case CONTACT_ADDRESS_SUCCESS: {
      return setDataForEmailSymbol(state, action.email, action.symbol, {
        address: action.address,
        requesting: false,
        successful: true,
        errors: [],
      });
    }
    case CONTACT_ADDRESS_FAILURE: {
      return setDataForEmailSymbol(state, action.email, action.symbol, {
        requesting: false,
        successful: false,
        errors: action.errors,
      });
    }
    default: {
      return state;
    }
  }
}
