import { createSelector } from 'reselect';

// (state, symbol) => { string: [ string ] }
export const transactionHashesByAddressForSymbolSelector = createSelector(
  state => state.transactions.transactionsByWallet,
  (state, symbol) => symbol,
  (transactionsByWallet, symbol) => transactionsByWallet[symbol] || {}
);

// (state, symbol, address) => [ string ]
export const transactionHashesForWalletSelector = createSelector(
  transactionHashesByAddressForSymbolSelector,
  (state, symbol, address) => address,
  (transactionHashesByAddressForSymbol, address) =>
    transactionHashesByAddressForSymbol[address] || []
);

// (state, symbol) => { string: {} }
export const blockchainTransactionsForSymbolSelector = createSelector(
  state => state.transactions.blockchainTransactions,
  (state, symbol) => symbol,
  (blockchainTransactions, symbol) => blockchainTransactions[symbol] || {}
);

// (state, symbol) => {}
export const blockchainTransactionSelector = createSelector(
  blockchainTransactionsForSymbolSelector,
  (state, symbol, hash) => hash,
  (transactionsForSymbol, hash) => transactionsForSymbol[hash]
);

// (state, symbol, address) => [ {} ]
export const transactionsForWalletSelector = createSelector(
  transactionHashesForWalletSelector,
  blockchainTransactionsForSymbolSelector,
  (transactionHashesForWallet, blockchainTransactionsForSymbol) =>
    transactionHashesForWallet.map(
      hash => blockchainTransactionsForSymbol[hash]
    )
);

// (state, symbol, address, sort) => [ {} ] (sorted)
export const sortedTransactionsForWalletSelector = createSelector(
  transactionsForWalletSelector,
  (state, symbol, address, sort) => sort,
  (transactionsForWallet, sort = 'ASC') =>
    sort.toUpperCase() === 'ASC'
      ? [...transactionsForWallet].sort((a, b) => a.date - b.date)
      : [...transactionsForWallet].sort((a, b) => b.date - a.date)
);

// (state, symbol) => [ string ]
export const contactTransactionUidsForSymbolSelector = createSelector(
  state => state.transactions.contactTransactionsBySymbol,
  (state, symbol) => symbol,
  (contactTransactionUids, symbol) => contactTransactionUids[symbol] || []
);

// (state, symbol) => [ {} ]
export const contactTransactionsForSymbolSelector = createSelector(
  contactTransactionUidsForSymbolSelector,
  state => state.transactions.contactTransactions,
  (contactTransactionUidsForSymbol, contactTransactions) =>
    contactTransactionUidsForSymbol.map(uid => contactTransactions[uid])
);

// (state, symbol, sort) => [ {} ] (sorted)
export const sortedContactTransactionsForSymbolSelector = createSelector(
  contactTransactionsForSymbolSelector,
  (state, symbol, sort) => sort,
  (contactTransactionsForSymbol, sort = 'ASC') =>
    sort.toUpperCase() === 'ASC'
      ? [...contactTransactionsForSymbol].sort((a, b) => a.date - b.date)
      : [...contactTransactionsForSymbol].sort((a, b) => b.date - a.date)
);

// (state, symbol, address) => [ {} ] (sorted)
export const fiatTradesForWalletSelector = createSelector(
  transactionsForWalletSelector,
  transactionsForWallet => transactionsForWallet.filter(tx => tx.fiatTrade)
);

// (state, symbol, address, sort) => [ {} ] (sorted)
export const sortedFiatTradesForWalletSelector = createSelector(
  fiatTradesForWalletSelector,
  (state, symbol, address, sort) => sort,
  (fiatTrades, sort = 'ASC') =>
    sort.toUpperCase() === 'ASC'
      ? [...fiatTrades].sort((a, b) => a.date - b.date)
      : [...fiatTrades].sort((a, b) => b.date - a.date)
);

// (state, [ { symbol, publicAddress } ]) => [ {} ] (sorted)
export const fiatTradesForWalletsSelector = createSelector(
  (state, wallets = []) =>
    wallets.reduce(
      (list, { symbol, publicAddress }) => [
        ...list,
        ...fiatTradesForWalletsSelector(state, symbol, publicAddress),
      ],
      []
    )
);

// (state, [ { symbol, publicAddress } ], sort) => [ {} ] (sorted)
export const sortedFiatTradesForWalletsSelector = createSelector(
  fiatTradesForWalletsSelector,
  (state, wallets, sort) => sort,
  (fiatTrades, sort = 'ASC') =>
    sort.toUpperCase() === 'ASC'
      ? [...fiatTrades].sort((a, b) => a.date - b.date)
      : [...fiatTrades].sort((a, b) => b.date - a.date)
);
