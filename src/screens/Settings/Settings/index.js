import { connect } from 'react-redux';

import Settings from './Settings';
import { updateEnablePushNotifications } from '../actions';
import {isSignedInSelector} from 'containers/User/selectors';

const mapStateToProps = state => {
  return {
    enablePushNotifications: state.settings.enablePushNotifications,
    isSignedIn: isSignedInSelector(state)
  };
};

const mapDispatchToProps = {
  updateEnablePushNotifications,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
