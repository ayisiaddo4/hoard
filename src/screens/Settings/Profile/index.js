import { connect } from 'react-redux';
import { updateUser } from 'containers/User/actions';
import { userSelector } from 'containers/User/selectors';

import Profile from './Profile';

const mapStateToProps = (state) => {
  return {
    user: userSelector(state)
  };
};

const mapDispatchToProps = {
  updateUser
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
