import { createSelector } from 'reselect';
import { SUPPORTED_COINS_WALLET } from 'containers/App/constants';

export const allWalletsSelector = createSelector(
  state => state.wallet.walletIds,
  state => state.wallet.wallets,
  (ids, wallets) => ids.map(id => wallets[id])
);

export const walletsForSymbolSelector = createSelector(
  allWalletsSelector,
  (_, symbol) => symbol,
  (wallets, symbol) => wallets.filter(wallet => wallet.symbol === symbol)
);

export const walletSelector = createSelector(
  state => state.wallet.wallets,
  (_, id) => id,
  (wallets, id) => wallets[id]
);

export const mnemonicPhraseSelector = createSelector(
  state => state.wallet,
  walletState => walletState.mnemonicPhrase
);

export const isMnemonicInitializedSelector = createSelector(
  state => state.wallet,
  walletState => walletState.isMnemonicInitialized
);

export const availableCoinsSelector = createSelector(
  state => state.wallet.hoardWallets,
  hoardWallets => SUPPORTED_COINS_WALLET.filter(coin => !hoardWallets[coin])
);
