import { connect } from 'react-redux';

import { updateTradingPair } from '../actions';
import { SUPPORTED_TRADING_PAIRS } from '../constants';
import { tradingPairSelector } from '../selectors';

import DisplayCurrency from './DisplayCurrency';

const mapStateToProps = state => {
  return {
    tradingPairs: SUPPORTED_TRADING_PAIRS,
    selectedTradingPair: tradingPairSelector(state),
  };
};

const mapDispatchToProps = {
  updateTradingPair,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DisplayCurrency);
