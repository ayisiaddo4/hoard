import { connect } from 'react-redux';

import UpdatePin from './UpdatePin';

import { notificationRecieved } from 'containers/Notifications/actions';

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = {
  notificationRecieved,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdatePin);
