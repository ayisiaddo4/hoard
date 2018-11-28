import { connect } from 'react-redux';

import Security from './Security';
import {isSignedInSelector} from 'containers/User/selectors';

const mapStateToProps = (state) => {
  return {
    isSignedIn: isSignedInSelector(state)
  };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Security);
