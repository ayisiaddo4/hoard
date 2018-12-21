import { connect } from 'react-redux';
import { hideReceiveModal } from './actions';
import ReceiveModal from './ReceiveModal';
import { allWalletsSelector } from 'screens/Wallet/selectors';

const mapStateToProps = state => {
  return {
    wallets: allWalletsSelector(state),
    selectedWalletId: state.receiveModal.selectedWalletId,
    show: state.receiveModal.show,
  };
};

const mapDispatchToProps = {
  hideReceiveModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReceiveModal);
