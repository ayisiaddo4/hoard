/*
|--------------------------------------------------
| Mnemonic Component - connected to redux, and passes
| state & actions to ./Mnemonic component.
|--------------------------------------------------
*/
import { connect } from 'react-redux';
import { initializeMnemonic } from '../actions';
import { mnemonicPhraseSelector } from '../selectors';

import Mnemonic from './Mnemonic';

function mapStateToProps(state) {
  return { hasMnemonic: !!mnemonicPhraseSelector(state) };
}

const mapDispatchToProps = {
  initializeMnemonic,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Mnemonic);
