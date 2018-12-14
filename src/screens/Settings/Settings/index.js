import { connect } from 'react-redux';

import Settings from './Settings';
import { updateEnablePushNotifications } from '../actions';
import {isSignedInSelector} from 'containers/User/selectors';
import {enablePushNotificationsSelector} from 'screens/Settings/selectors';

const mapStateToProps = state => {
  return {
    enablePushNotifications: enablePushNotificationsSelector(state),
    isSignedIn: isSignedInSelector(state)
  };
};

const mapDispatchToProps = {
  updateEnablePushNotifications,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
