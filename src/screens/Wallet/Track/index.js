/*
|--------------------------------------------------
| Track Component - connected to redux, and passes
| state & actions to ./Track component.
|--------------------------------------------------
*/
import { connect } from 'react-redux';
import { trackSymbol } from '../actions';
import { availableCoinsSelector } from '../selectors';

import Track from './Track';

function mapStateToProps(state) {
  const { track_requesting, track_successful } = state.wallet;
  return {
    track_requesting,
    track_successful,
    availableCoins: availableCoinsSelector(state),
  };
}

const mapDispatchToProps = {
  trackSymbol,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Track);
