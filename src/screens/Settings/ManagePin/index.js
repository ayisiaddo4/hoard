import { connect } from 'react-redux';

import ManagePin from './ManagePin';
import { isSignedInSelector } from 'containers/User/selectors';

const mapStateToProps = state => {
  return {
    isSignedIn: isSignedInSelector(state),
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManagePin);
