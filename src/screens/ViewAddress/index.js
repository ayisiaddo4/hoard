import { connect } from 'react-redux';
import ViewAddress from './ViewAddress';
import { walletSelector } from 'screens/Wallet/selectors';

const mapStateToProps = (state, ownProps) => {
  const selectedId =
    ownProps.navigation.state &&
    ownProps.navigation.state.params &&
    ownProps.navigation.state.params.wallet;

  return {
    wallet: walletSelector(state, selectedId),
  };
};

export default connect(mapStateToProps)(ViewAddress);
