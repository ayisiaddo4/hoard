import { connect } from 'react-redux';

import Settings from './Settings';
import { updateEnablePushNotifications } from '../actions';

const mapStateToProps = state => {
  return {
    enablePushNotifications: state.settings.enablePushNotifications,
  };
};

const mapDispatchToProps = {
  updateEnablePushNotifications,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
