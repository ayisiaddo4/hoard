import { connect } from 'react-redux';
import { hideSendModal } from './actions';
import SendModal from './SendModal';
import { sendFunds } from 'screens/Wallet/actions';
import { selectContact } from 'sagas/contacts/actions';
import { allWalletsSelector } from 'screens/Wallet/selectors';

const mapStateToProps = state => {
  return {
    contacts: state.contacts,
    wallets: allWalletsSelector(state),
    selectedWalletId: state.sendModal.selectedWalletId,
    show: state.sendModal.show,
  };
};

const mapDispatchToProps = {
  hideSendModal,
  selectContact,
  sendFunds,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendModal);
