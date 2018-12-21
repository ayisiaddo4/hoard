import { connect } from 'react-redux';
import TransactionStatus from './TransactionStatus';
import { transactionStatusSelector } from './selectors';

const mapStateToProps = (state, ownProps) => {
  return {
    transaction: transactionStatusSelector(
      state,
      ownProps.navigation.state.params.id
    ),
  };
};

export default connect(mapStateToProps)(TransactionStatus);
