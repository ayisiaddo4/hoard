import {
  WALLET_SEND_FUNDS_REQUESTING,
  WALLET_SEND_FUNDS_SUCCESS,
  WALLET_SEND_FUNDS_ERROR,
} from 'screens/Wallet/constants';
import { RECORD_CONTACT_TRANSACTION } from 'sagas/transactions/constants';
import { TYPE_SEND, TYPE_REQUEST } from 'screens/SendRequest/constants';

import {
  TRANSACTION_PENDING,
  TRANSACTION_SUCCESS,
  TRANSACTION_ERROR,
} from './constants';

const initialState = {
  // <id>: <status>
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case RECORD_CONTACT_TRANSACTION: {
      return {
        ...state,
        [action.transaction.details.uid]: {
          status: TRANSACTION_PENDING,
        },
      };
    }
    case WALLET_SEND_FUNDS_REQUESTING: {
      return {
        ...state,
        [action.id]: {
          status: TRANSACTION_PENDING,
        },
      };
    }
    case WALLET_SEND_FUNDS_SUCCESS: {
      return {
        ...state,
        [action.id]: {
          status: TRANSACTION_SUCCESS,
        },
      };
    }
    case WALLET_SEND_FUNDS_ERROR: {
      return {
        ...state,
        [action.id]: {
          status: TRANSACTION_ERROR,
          error: action.error,
        },
      };
    }
    default:
      return state;
  }
}
