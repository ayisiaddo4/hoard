import {
  SEARCH_FOR_TRANSACTIONS,
  TRANSACTION_FOUND,
  RECORD_CONTACT_TRANSACTION,
  CANCEL_CONTACT_TRANSACTION_REQUESTING,
  TRANSACTION_UPDATE,
} from './constants';

export function searchForTransactions(id) {
  return {
    type: SEARCH_FOR_TRANSACTIONS,
    id,
  };
}

export function recordContactTransaction(transaction) {
  return {
    type: RECORD_CONTACT_TRANSACTION,
    transaction,
  };
}

export function cancelContactTransaction(transaction) {
  return {
    type: CANCEL_CONTACT_TRANSACTION_REQUESTING,
    transaction,
  };
}

export function transactionFound(transaction, doNotSave = false) {
  return { type: TRANSACTION_FOUND, transaction, doNotSave };
}

export function updateTransaction(transaction) {
  return { type: TRANSACTION_UPDATE, transaction };
}
