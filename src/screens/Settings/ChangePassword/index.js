import { connect } from 'react-redux';
import { updateUser } from 'containers/User/actions';
import { usernameSelector } from 'containers/User/selectors';
import { notificationRecieved } from 'containers/Notifications/actions';

import ChangePassword from './ChangePassword';

const mapStateToProps = state => {
  return {
    username: usernameSelector(state),
  };
};

const mapDispatchToProps = {
  notificationRecieved,
  updateUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangePassword);
