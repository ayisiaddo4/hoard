import { connect } from 'react-redux';
import CoinInformation from './CoinInformation';
import { getCurrencyHistory } from 'sagas/pricing/actions';
import { walletSelector } from 'screens/Wallet/selectors';
import { deleteWallet } from 'screens/Wallet/actions';
import { isSignedInSelector } from 'containers/User/selectors';
import {
  sortedTransactionsForWalletSelector,
  sortedContactTransactionsForSymbolSelector,
} from 'sagas/transactions/selectors';
import {
  updateTransaction,
  cancelContactTransaction,
} from 'sagas/transactions/actions';
import { showReceiveModal } from 'containers/ReceiveModal/actions';
import { showSendModal } from 'containers/SendModal/actions';
import {
  notificationRecieved,
  notificationDismissed,
  startNotificationFlow,
} from 'containers/Notifications/actions';

const mapStateToProps = (store, ownProps) => {
  const id = ownProps.navigation.state.params.id;

  const wallet = walletSelector(store, id);
  const isSignedIn = isSignedInSelector(store);

  let transactions = [];
  let contactTransactions = [];

  transactions = sortedTransactionsForWalletSelector(
    store,
    wallet.symbol,
    wallet.publicAddress,
    'DESC'
  );

  contactTransactions = isSignedIn
    ? sortedContactTransactionsForSymbolSelector(
        store,
        wallet.symbol,
        'DESC'
      ).filter(tx => tx.details.status === 'pending')
    : [];

  const pricing = store.pricing[wallet.symbol];

  return {
    transactions,
    contactTransactions,
    wallet,
    isSignedIn,
    pricing,
  };
};

const mapDispatchToProps = {
  cancelContactTransaction,
  getCurrencyHistory,
  updateTransaction,
  deleteWallet,
  notificationRecieved,
  notificationDismissed,
  startNotificationFlow,
  showSendModal,
  showReceiveModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoinInformation);
