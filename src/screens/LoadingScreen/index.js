import { connect } from 'react-redux';
import LoadingScreen from './LoadingScreen';

const mapStateToProps = state => {
  return {
    appInitialized: state.app.hasPreviouslyInitialized,
    walletHydrated: state.wallet.hydrationCompleted,
    transactionsHydrated: state.transactions.hydrationCompleted,
    pricingInitialized: state.pricing.initialized,
    to: state.loadingReducer.postLoadRedirect,
  };
};

export default connect(mapStateToProps)(LoadingScreen);
