import { connect } from 'react-redux';

import { getCurrencyPrice } from 'sagas/pricing/actions';

import ICO from './ICO';

const mapStateToProps = ({ pricing }) => ({
  prices: {
    BTC: pricing.BTC.price.price,
    ETH: pricing.ETH.price.price,
  },
});

const mapDispatchToProps = {
  getCurrencyPrice,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ICO);
