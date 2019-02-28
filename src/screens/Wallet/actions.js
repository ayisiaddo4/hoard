import {
  WALLET_INITIALIZE_PASSPHRASE,
  WALLET_DELETE,
  WALLET_TRACK_SYMBOL,
  WALLET_TRACK_SYMBOL_SUCCESS,
  WALLET_TRACK_SYMBOL_ERROR,
  WALLET_IMPORT,
  WALLET_IMPORT_SUCCESS,
  WALLET_IMPORT_ERROR,
  WALLET_UPDATE_BALANCE_REQUESTING,
  WALLET_SEND_FUNDS_REQUESTING,
} from './constants';

export function initializeMnemonic(mnemonicPhrase, additionalInfo) {
  return {
    type: WALLET_INITIALIZE_PASSPHRASE,
    mnemonicPhrase,
    additionalInfo,
  };
}

export function trackSymbol(symbol, additionalInfo) {
  return {
    type: WALLET_TRACK_SYMBOL,
    symbol,
    additionalInfo,
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

export function importWallet(symbol, importType, seed, additionalInfo) {
  return {
    type: WALLET_IMPORT,
    symbol,
    importType,
    seed,
    additionalInfo,
  };
}

export function deleteWallet(id) {
  return {
    type: WALLET_DELETE,
    id,
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
