import { connect } from 'react-redux';
import { notificationDismissed } from './actions';
import Notifications from './Notifications';

const mapStateToProps = ({ notifications }) => ({
  notifications,
});
const mapDispatchToProps = {
  notificationDismissed,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications);
