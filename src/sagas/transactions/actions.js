import {
  BLOCK_ADDED_TO_QUEUE,
  BLOCK_UPDATED,
  INTERESTING_BLOCK_FOUND,
  SEARCH_FOR_INTERESTING_BLOCKS,
  TRANSACTION_FOUND,
  RECORD_CONTACT_TRANSACTION,
  CANCEL_CONTACT_TRANSACTION_REQUESTING,
  TRANSACTION_UPDATE,
} from './constants';

export function triggerSearchForInterestingBlocks(publicAddress, symbol) {
  return {
    type: SEARCH_FOR_INTERESTING_BLOCKS,
    publicAddress,
    symbol,
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

export function blockUpdated() {
  return { type: BLOCK_UPDATED };
}

export function blockAddedToQueue() {
  return { type: BLOCK_ADDED_TO_QUEUE };
}

export function interestingBlockFound(block) {
  return { type: INTERESTING_BLOCK_FOUND, block };
}
