import { connect } from 'react-redux';
import CreateSupportTicket from './CreateSupportTicket';
import { isSignedInSelector, emailSelector } from 'containers/User/selectors';

const mapStateToProps = state => {
  return {
    emailAddress: emailSelector(state),
    isSignedIn: isSignedInSelector(state),
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateSupportTicket);
