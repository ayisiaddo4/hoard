import { connect } from 'react-redux';
import Dashboard from './Dashboard';
import { getCurrencyPrice, getCurrencyHistory } from 'sagas/pricing/actions';
import { showReceiveModal } from 'containers/ReceiveModal/actions';
import { showSendModal } from 'containers/SendModal/actions';

const mapStateToProps = ({ pricing }) => ({ pricing });

const mapDispatchToProps = {
  getCurrencyPrice,
  getCurrencyHistory,
  showReceiveModal,
  showSendModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
