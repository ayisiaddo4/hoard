import {connect} from 'react-redux';
import PortfolioChart from './PortfolioChart';
import { walletsForSymbolSelector } from 'screens/Wallet/selectors';
import { sortedTransactionsForWalletSelector, sortedFiatTradesForWalletsSelector } from 'sagas/transactions/selectors';

const mapStateToProps = (state, ownProps) => {
  const { wallets } = ownProps;
  let transactionsToCoalesce;
  if ( wallets && wallets.length ) {
    transactionsToCoalesce = wallets.map(({symbol, publicAddress}) => ({
      symbol,
      address: publicAddress,
      transactions: sortedTransactionsForWalletSelector(state, symbol, publicAddress)
    }));
  }

  return {
    transactionsToCoalesce: transactionsToCoalesce,
    fiatTrades: sortedFiatTradesForWalletsSelector(state, wallets, 'ASC')
  };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioChart);
