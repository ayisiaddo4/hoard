/**
|--------------------------------------------------
| Signup Component - connected to redux, and passes
| state & actions to ./Signup component.
|--------------------------------------------------
*/
import { connect } from 'react-redux';
import signupRequest from './actions';

import Signup from './Signup';

function mapStateToProps(state) {
  return { signup: state.signup };
}

export default connect(
  mapStateToProps,
  { signupRequest }
)(Signup);
