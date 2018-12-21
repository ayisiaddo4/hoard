import { connect } from 'react-redux';
import SendRequest from './SendRequest';
import { sendFunds } from 'screens/Wallet/actions';
import { getCurrencyPrice } from 'sagas/pricing/actions';
import { recordContactTransaction } from 'sagas/transactions/actions';
import { allWalletsSelector } from 'screens/Wallet/selectors';
import { tradingPairSelector } from 'screens/Settings/selectors';
import { isSignedInSelector, emailSelector } from 'containers/User/selectors';
import { SUPPORTED_COINS_WALLET } from 'containers/App/constants';

const mapStateToProps = state => {
  return {
    prices: SUPPORTED_COINS_WALLET.reduce(
      (prices, symbol) => ({
        ...prices,
        [symbol]:
          state.pricing &&
          state.pricing[symbol] &&
          state.pricing[symbol].price &&
          state.pricing[symbol].price.price,
      }),
      {}
    ),
    wallets: allWalletsSelector(state),
    emailAddress: emailSelector(state),
    isSignedIn: isSignedInSelector(state),
    tradingPair: tradingPairSelector(state),
  };
};

const mapDispatchToProps = {
  recordContactTransaction,
  getCurrencyPrice,
  sendFunds,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendRequest);
