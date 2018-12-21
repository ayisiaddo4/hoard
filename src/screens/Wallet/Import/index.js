/*
|--------------------------------------------------
| Import Component - connected to redux, and passes
| state & actions to ./Import component.
|--------------------------------------------------
*/
import { connect } from 'react-redux';
import { importWallet } from '../actions';

import Import from './Import';

function mapStateToProps(state) {
  return { wallet: state.wallet };
}

const mapDispatchToProps = {
  importWallet,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Import);
