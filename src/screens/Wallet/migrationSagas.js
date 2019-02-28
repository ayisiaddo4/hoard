import Config from 'react-native-config';
import { AsyncStorage } from 'react-native';
import {
  select,
  all,
  takeLatest,
  takeEvery,
  call,
  put,
  fork,
} from 'redux-saga/effects';
import { mnemonicPhraseSelector } from './selectors';
import RvnWallet from 'screens/Wallet/WalletInstances/RvnWallet';
import StoreRegistry from 'lib/store-registry';
import {
  notificationDismissed,
  notificationRecieved,
  notificationUpdated,
} from 'containers/Notifications/actions';
import {
  SYMBOL_RVN,
  SYMBOL_ETH,
  SYMBOL_BTC,
  SYMBOL_HOARD,
} from 'containers/App/constants';
import { importWallet } from './actions';
const WALLET_VERSION_STORAGE_KEY = 'wallets/storage/wallet_version';

export async function getStoredWalletVersion(symbol) {
  try {
    const walletVersion = await AsyncStorage.getItem(
      `${WALLET_VERSION_STORAGE_KEY}/${symbol}`
    );

    if (walletVersion.length) {
      return Number(walletVersion);
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
}

export function storeWalletVersion(symbol, version) {
  return AsyncStorage.setItem(
    `${WALLET_VERSION_STORAGE_KEY}/${symbol}`,
    version.toString()
  );
}

export async function migrateWalletToNewVersion(wallet, previousVersion) {
  switch (wallet.symbol) {
    case SYMBOL_BTC: {
      return btcMigrations(wallet, previousVersion);
    }
    case SYMBOL_RVN: {
      return rvnMigrations(wallet, previousVersion);
    }
    case SYMBOL_ETH: {
      return ethMigrations(wallet, previousVersion);
    }
    case SYMBOL_HOARD: {
      return hoardMigrations(wallet, previousVersion);
    }
    default: {
      return null;
    }
  }
}

// eslint-disable-next-line no-unused-vars
export async function ethMigrations(wallet, previousVersion) {
  return storeWalletVersion(wallet.symbol, wallet.version);
}

// eslint-disable-next-line no-unused-vars
export async function hoardMigrations(wallet, previousVersion) {
  return storeWalletVersion(wallet.symbol, wallet.version);
}

// eslint-disable-next-line no-unused-vars
export async function btcMigrations(wallet, previousVersion) {
  return storeWalletVersion(wallet.symbol, wallet.version);
}

export async function rvnMigrations(wallet, previousVersion) {
  if (previousVersion === null) {
    const mnemonicPhrase = mnemonicPhraseSelector(
      StoreRegistry.getStore().getState()
    );

    const walletWithInaccurateAddress = new RvnWallet(true, mnemonicPhrase, {
      useBtcDerivationPath: true,
    });

    const shouldUpgrade = await walletWithInaccurateAddress.shouldUpgrade();

    if (shouldUpgrade) {
      StoreRegistry.getStore().dispatch(
        importWallet('RVN', 'mnemonic', mnemonicPhrase, {
          useBtcDerivationPath: true,
          reviewOnly: true,
        })
      );
    }
  }

  return storeWalletVersion(wallet.symbol, wallet.version);
}
