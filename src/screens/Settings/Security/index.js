import { connect } from 'react-redux';

import Security from './Security';
import { isSignedInSelector } from 'containers/User/selectors';
import { updateEnableBiometrics } from 'screens/Settings/actions';

const mapStateToProps = state => {
  return {
    enableBiometrics: state.settings.enableBiometrics,
    isSignedIn: isSignedInSelector(state),
  };
};

const mapDispatchToProps = {
  updateEnableBiometrics,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Security);
