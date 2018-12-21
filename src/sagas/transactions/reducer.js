import {
  HYDRATE_TRANSACTIONS,
  RECORD_CONTACT_TRANSACTION,
  CONFIRM_CONTACT_TRANSACTION,
  CANCEL_CONTACT_TRANSACTION_SUCCESS,
  TRANSACTION_FOUND,
  TRANSACTION_UPDATE,
} from './constants';

// needed_transaction_keys => {type, date, symbol, to, from, amount, price, details}

const initialState = {
  version: 2,
  hydrationCompleted: false,
  contactTransactionsBySymbol: {
    // <symbol>
    //   [uid]
  },
  contactTransactions: {
    // <uid>
    //   { ...needed_transaction_keys, contact, details: { uid } }
  },
  transactionsByWallet: {
    // <symbol>
    //   <address>
    //     [ hash ]
  },
  blockchainTransactions: {
    // <symbol>
    //   <hash>
    //     { ... needed_transaction_keys, fiatTrade?, details: { hash } }
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case HYDRATE_TRANSACTIONS: {
      return {
        ...state,
        ...action.state,
        hydrationCompleted: true,
      };
    }
    case CANCEL_CONTACT_TRANSACTION_SUCCESS: {
      return {
        ...state,
        contactTransactions: {
          ...state.contactTransactions,
          [action.transaction.details.uid]: {
            ...action.transaction,
            details: {
              ...action.transaction.details,
              status: 'denied',
            },
          },
        },
      };
    }
    case CONFIRM_CONTACT_TRANSACTION: {
      return {
        ...state,
        contactTransactions: {
          ...state.contactTransactions,
          [action.transaction_uid]: {
            ...state.contactTransactions[action.transaction_uid],
            details: {
              ...state.contactTransactions[action.transaction_uid].details,
              transaction_hash: action.transaction_hash,
              status: 'confirmed',
            },
          },
        },
      };
    }
    case RECORD_CONTACT_TRANSACTION: {
      const {
        symbol,
        details: { uid },
      } = action.transaction;
      const { contactTransactionsBySymbol = {}, contactTransactions } = state;

      let newSymbolState = contactTransactionsBySymbol[symbol] || [];
      if (!contactTransactions[uid]) {
        newSymbolState = [...newSymbolState, uid];
      }

      return {
        ...state,
        contactTransactions: {
          ...contactTransactions,
          [uid]: action.transaction,
        },
        contactTransactionsBySymbol: {
          ...contactTransactionsBySymbol,
          [symbol]: newSymbolState,
        },
      };
    }
    case TRANSACTION_FOUND: {
      const {
        symbol,
        to,
        from,
        details: { hash },
      } = action.transaction;
      const { blockchainTransactions, transactionsByWallet } = state;

      const blockchainTransactionsForSymbol =
        blockchainTransactions[symbol] || {};

      if (blockchainTransactionsForSymbol[hash]) {
        return state;
      }

      const transactionsByWalletForSymbol = transactionsByWallet[symbol] || {};
      const toTransactions = transactionsByWalletForSymbol[to] || [];
      const fromTransactions = transactionsByWalletForSymbol[from] || [];

      return {
        ...state,
        blockchainTransactions: {
          ...blockchainTransactions,
          [symbol]: {
            ...blockchainTransactionsForSymbol,
            [hash]: action.transaction,
          },
        },
        transactionsByWallet: {
          ...transactionsByWallet,
          [symbol]: {
            ...transactionsByWalletForSymbol,
            [to]: [...toTransactions, hash],
            [from]: [...fromTransactions, hash],
          },
        },
      };
    }
    case TRANSACTION_UPDATE: {
      const {
        symbol,
        details: { hash },
      } = action.transaction;
      const { blockchainTransactions } = state;

      const blockchainTransactionsForSymbol =
        blockchainTransactions[symbol] || {};

      return {
        ...state,
        blockchainTransactions: {
          ...blockchainTransactions,
          [symbol]: {
            ...blockchainTransactionsForSymbol,
            [hash]: action.transaction,
          },
        },
      };
    }
    default: {
      return state;
    }
  }
}
