import {
  WALLET_INITIALIZE_PASSPHRASE,
  WALLET_TRACK_SYMBOL,
  WALLET_TRACK_SYMBOL_SUCCESS,
  WALLET_TRACK_SYMBOL_ERROR,
  WALLET_IMPORT,
  WALLET_IMPORT_SUCCESS,
  WALLET_IMPORT_ERROR,
  WALLET_UPDATE_BALANCE_REQUESTING,
  WALLET_SEND_FUNDS_REQUESTING,
} from './constants';

export function initializeMnemonic(mnemonicPhrase) {
  return {
    type: WALLET_INITIALIZE_PASSPHRASE,
    mnemonicPhrase,
  };
}

export function trackSymbol(symbol) {
  return {
    type: WALLET_TRACK_SYMBOL,
    symbol,
  };
}

export function trackSymbolSuccess(payload) {
  return {
    type: WALLET_TRACK_SYMBOL_SUCCESS,
    payload,
  };
}

export function trackSymbolFailure(error) {
  return {
    type: WALLET_TRACK_SYMBOL_ERROR,
    error,
  };
}

export function importWallet(symbol, importType, seed) {
  return {
    type: WALLET_IMPORT,
    symbol,
    importType,
    seed,
  };
}

export function importWalletSuccess(payload) {
  return {
    type: WALLET_IMPORT_SUCCESS,
    payload,
  };
}

export function importWalletFailure(error) {
  return {
    type: WALLET_IMPORT_ERROR,
    error,
  };
}

export function updateBalance(id) {
  return {
    type: WALLET_UPDATE_BALANCE_REQUESTING,
    id,
  };
}

export function sendFunds(fromId, toPublicAddress, amount, transaction_uid) {
  return {
    type: WALLET_SEND_FUNDS_REQUESTING,
    id: Math.floor(Math.random() * 1e10),
    fromId,
    toPublicAddress,
    amount,
    transaction_uid,
  };
}
