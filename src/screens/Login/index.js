/**
|--------------------------------------------------
| Login Component - connected to redux, and passes
| state & actions to ./Login component.
|--------------------------------------------------
*/
import { connect } from 'react-redux';
import loginRequest from './actions';
import Login from './Login';
import { mnemonicPhraseSelector } from 'screens/Wallet/selectors';

function mapStateToProps(state) {
  return {
    login: state.login,
    hasMnemonic: !!mnemonicPhraseSelector(state),
  };
}

const mapDispatchToProps = {
  loginRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
