import { AsyncStorage } from "react-native";
import { select, all, takeLatest, takeEvery, call, put, fork } from "redux-saga/effects";
import { initializeWallet } from "./WalletInstances";
import { INIT_REQUESTING, SUPPORTED_COINS_WALLET, SYMBOL_BOAR } from "containers/App/constants";
import StoreRegistry from 'lib/store-registry';
import {
  WALLET_INITIALIZE_PASSPHRASE,
  WALLET_HYDRATED,
  WALLET_TRACK_SYMBOL,
  WALLET_TRACK_SYMBOL_SUCCESS,
  WALLET_IMPORT,

  WALLET_UPDATE_BALANCE_ERROR,
  WALLET_UPDATE_BALANCE_REQUESTING,
  WALLET_UPDATE_BALANCE_SUCCESS,
  WALLET_SEND_FUNDS_REQUESTING,
  WALLET_SEND_FUNDS_SUCCESS,
  WALLET_SEND_FUNDS_ERROR
} from "./constants";
import { SEARCH_FOR_TRANSACTIONS } from 'sagas/transactions/constants';
import { INIT_USER } from 'containers/User/constants';
import {
  initializeMnemonic,
  updateBalance,
  importWallet,
  importWalletSuccess,
  importWalletFailure,
  trackSymbol,
  trackSymbolSuccess,
  trackSymbolFailure,
} from "./actions";

import {userUidSelector} from "containers/User/selectors";
import {
  allWalletsSelector,
  mnemonicPhraseSelector
} from "./selectors";

import api from 'lib/api';

const WALLET_STORAGE_KEY = "wallets/storage/wallets";
const MNEMONIC_STORAGE_KEY = "wallets/storage/mnemonic";

const previouslyDefinedKeys = {};
const makeId = () => {
  const id = Math.floor(Math.random() * 1e15).toString();
  if (previouslyDefinedKeys[id]) {
    return makeId();
  } else {
    previouslyDefinedKeys[id] = true;
    return id;
  }
};

const wallets = {
  /*
    <id>: Wallet instance
  */
};

export function* initWalletsFlow() {
  yield call(hydrate);
}

export async function getStoredMnemonic() {
  try {
    const mnemonic = await AsyncStorage.getItem(MNEMONIC_STORAGE_KEY);
    return mnemonic;
  } catch(e) {
    return '';
  }
}

export async function getStoredWallets() {
  try {
    const json = await AsyncStorage.getItem(WALLET_STORAGE_KEY);
    const wallets = JSON.parse(json);

    if (!wallets) {
      throw new Error('No stored wallets');
    }

    if(!Array.isArray(wallets)) {
      throw new Error('Improperly stored wallets');
    }

    return wallets;
  } catch(e) {
    return [];
  }
}

export function* hydrate() {
  const mnemonic = yield call(getStoredMnemonic);
  const storedWallets = yield call(getStoredWallets);

  yield put(initializeMnemonic(mnemonic));

  yield all(storedWallets.map(wallet => {
    if (wallet.imported) {
      return put(importWallet(wallet.symbol, 'privateKey', wallet.privateKey));
    }
  }));

  yield put({type: WALLET_HYDRATED});
}

export async function storeMnemonic(action) {
  AsyncStorage.setItem(MNEMONIC_STORAGE_KEY, action.mnemonicPhrase || '');
}

export function* storeWallets() {
  const allWallets = yield select(allWalletsSelector);
  const storableWallets = [];

  for (const wallet of allWallets) {
    if (wallet.imported) {
      const privateKey = yield call(wallets[wallet.id].getPrivateKey);
      storableWallets.push({...wallet, privateKey});
    } else {
      storableWallets.push(wallet);
    }
  }

  yield call(
    AsyncStorage.setItem,
    WALLET_STORAGE_KEY,
    JSON.stringify(storableWallets)
  );
}

async function commonWalletInitializationActions(wallet) {
  const id = makeId();
  const symbol = wallet.symbol;
  const publicAddress = await wallet.getPublicAddress();
  wallets[id] = wallet;

  if (symbol === 'ETH') {
    wallet.listenForBalanceChange((balance) => {
      StoreRegistry.getStore().dispatch({
        type: WALLET_UPDATE_BALANCE_SUCCESS,
        payload: {
          id,
          balance: Number(balance.toString())
        }
      });
    });
  } else if (symbol === SYMBOL_BOAR) {
    setTimeout(
      () => StoreRegistry.getStore().dispatch({
        type: SEARCH_FOR_TRANSACTIONS,
        id,
        wallet
      }),
      0
    );
  }

  setTimeout(
    () => StoreRegistry.getStore().dispatch(updateBalance(id)),
    0
  );

  return {
    id,
    symbol,
    balance: null,
    publicAddress
  };
}

async function createWallet(symbol, mnemonicString) {
  return commonWalletInitializationActions(initializeWallet(symbol, true, mnemonicString));
}

async function recoverWallet(symbol, privateKey) {
  return commonWalletInitializationActions(initializeWallet(symbol, false, privateKey));

}

async function sendFunds(fromId, toPublicAddress, amount) {
  const response = await wallets[fromId].send(
    amount,
    toPublicAddress
  );
  return response;
}

async function getBalance(id) {
  const balance = await wallets[id].getBalance();

  return {
    id,
    balance: Number(balance.toString())
  };
}

function* sendFundsFlow(action) {
  try {
    const { id, fromId, toPublicAddress, amount, transaction_uid } = action;

    const hash = yield call(sendFunds, fromId, toPublicAddress, amount);

    yield put({
      type: WALLET_SEND_FUNDS_SUCCESS,
      id,
      hash,
      transaction_uid
    });

    // refetch balance or keep an eye on the status of the request.
  } catch (error) {
    yield put({
      type: WALLET_SEND_FUNDS_ERROR,
      id: action.id,
      error
    });
  }
}

function* updateBalanceFlow(action) {
  const { id } = action;
  try {

    const payload = yield call(getBalance, id);

    yield put({
      type: WALLET_UPDATE_BALANCE_SUCCESS,
      payload
    });
  } catch (error) {
    yield put({
      type: WALLET_UPDATE_BALANCE_ERROR,
      id,
      error
    });
  }
}

function* importWalletFlow(action) {
  try {
    const {importType, symbol, seed} = action;

    let payload;
    if (importType === 'mnemonic') {
      payload = yield call(createWallet, symbol, seed);
    } else if (importType === 'privateKey') {
      payload = yield call(recoverWallet, symbol, seed);
    } else {
      throw new Error(`Invalid import type: ${importType}`);
    }

    yield put(importWalletSuccess(payload));
    yield call(storeWallets);
  } catch(e) {
    yield put(importWalletFailure(e));
  }
}

function* trackSymbolFlow(action) {
  try {
    const mnemonicPhrase = yield select(mnemonicPhraseSelector);

    if (!mnemonicPhrase) {
      throw new Error('No Mnemonic Phrase');
    }

    const payload = yield call(createWallet, action.symbol, mnemonicPhrase);

    const acion = trackSymbolSuccess(payload);
    yield put(acion);
    yield call(storeWallets);
  } catch(e) {
    yield put(trackSymbolFailure(e));
  }
}

function* setUpWallets(action) {
  if (action.mnemonicPhrase) {
    yield storeMnemonic(action);
    for (const symbol of SUPPORTED_COINS_WALLET) {
      yield put(trackSymbol(symbol));
    }
  }
}

export async function registerWallet({user_uid, address, currency}) {
  try {
    const response = await api.post(
      `https://erebor-staging.hoardinvest.com/users/${user_uid}/register_address`,
      {currency, address}
    );
    return true;
  } catch(e) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('register wallet error', e, e.errors);
    }
    return false;
  }
}

export function* registerWalletFromTrack(action) {
  const user_uid = yield select(userUidSelector);

  if (user_uid) {
    yield call(
      registerWallet,
      {user_uid, currency: action.payload.symbol, address: action.payload.publicAddress}
    );
  }
}

export function* registerWalletFromUser(action) {
  const wallets = yield select(allWalletsSelector);

  if (wallets.length && action.user && action.user.user_uid) {
    wallets.map(wallet =>
      registerWallet({user_uid: action.user.user_uid, currency: wallet.symbol, address: wallet.publicAddress})
    );
  }
}

export default function* walletSagaWatcher() {
  yield all([
    takeLatest(INIT_REQUESTING, initWalletsFlow),

    takeLatest(WALLET_INITIALIZE_PASSPHRASE, setUpWallets),
    takeEvery(WALLET_TRACK_SYMBOL, trackSymbolFlow),

    takeEvery(WALLET_TRACK_SYMBOL_SUCCESS, registerWalletFromTrack),
    takeEvery(INIT_USER, registerWalletFromUser),

    takeEvery(WALLET_IMPORT, importWalletFlow),

    takeEvery(WALLET_UPDATE_BALANCE_REQUESTING, updateBalanceFlow),
    takeLatest(WALLET_SEND_FUNDS_REQUESTING, sendFundsFlow)
  ]);
}
