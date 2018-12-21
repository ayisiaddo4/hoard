import { connect } from 'react-redux';

import Wallets from './Wallets';

import { getCurrencyPrice } from 'sagas/pricing/actions';

import { SUPPORTED_COINS_WALLET } from 'containers/App/constants';

import {
  allWalletsSelector,
  availableCoinsSelector,
  mnemonicPhraseSelector,
} from '../selectors';
import {
  allPricesLoadedSelector,
  totalHoldingsSelector,
} from 'sagas/pricing/selectors';
import { isSignedInSelector } from 'containers/User/selectors';
import {
  notificationRecieved,
  notificationDismissed,
} from 'containers/Notifications/actions';
import { updateBalance } from '../actions';

const mapStateToProps = state => ({
  wallets: allWalletsSelector(state),
  hasMnemonic: !!mnemonicPhraseSelector(state),
  isSignedIn: isSignedInSelector(state),
  allPricesLoaded: allPricesLoadedSelector(state),
  totalHoldings: totalHoldingsSelector(state),
  hasAvailableCoins: availableCoinsSelector(state).length > 0,
  prices: SUPPORTED_COINS_WALLET.reduce(
    (prices, symbol) => ({
      ...prices,
      [symbol]:
        state.pricing && state.pricing[symbol] && state.pricing[symbol].price,
    }),
    {}
  ),
});

const mapDispatchToProps = {
  getCurrencyPrice,
  notificationRecieved,
  notificationDismissed,
  updateBalance,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallets);
