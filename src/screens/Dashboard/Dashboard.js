import React from 'react';
import PropTypes from 'prop-types';
import { Button, StyleSheet, Text, View } from 'react-native';

import CurrencyButton from './CurrencyButton';
import ValueStatement from 'components/ValueStatement';
import IntervalSelectionChart from 'components/IntervalSelectionChart';
import Scene from 'components/Scene';
import { t } from 'translations/i18n';

import { Intervals } from 'components/GetCurrencyHistory';
import { getColors } from 'styles';
import { SYMBOL_BTC, SUPPORTED_COINS_PRICING } from 'containers/App/constants';

export default class Dashboard extends React.Component {
  static propTypes = {
    pricing: PropTypes.objectOf(
      PropTypes.shape({
        price: PropTypes.shape({
          price: PropTypes.number,
          requesting: PropTypes.bool,
        }).isRequired,
        history: PropTypes.shape({
          data: PropTypes.arrayOf(PropTypes.number),
          change: PropTypes.string,
          positive: PropTypes.bool,
          requesting: PropTypes.bool,
        }).isRequired,
      })
    ).isRequired,
    getCurrencyHistory: PropTypes.func.isRequired,
    getCurrencyPrice: PropTypes.func.isRequired,
    showReceiveModal: PropTypes.func.isRequired,
    showSendModal: PropTypes.func.isRequired,
  };

  state = {
    selectedCurrency: SYMBOL_BTC,
    selectedInterval: Intervals.hour,
  };

  componentDidMount() {
    this.triggerPriceRefresh();
  }

  handleChangeInterval = selectedInterval =>
    this.setState({ selectedInterval }, this.triggerPriceRefresh);

  triggerPriceRefresh = () => {
    this.props.getCurrencyPrice(this.state.selectedCurrency);
    this.props.getCurrencyHistory(this.state.selectedCurrency, {
      interval: this.state.selectedInterval,
    });
  };

  handleCurrencyChange = selectedCurrency => () =>
    this.setState({ selectedCurrency }, this.triggerPriceRefresh);

  render() {
    const themeColors = getColors();
    const themedStyles = getThemedStyles(themeColors);

    const { price, history } = this.props.pricing[this.state.selectedCurrency];

    return (
      <View style={[styles.container]}>
        <Text style={[styles.heading, themedStyles.heading]}>Markets</Text>
        <Text style={[styles.date, themedStyles.date]}>September 2</Text>
        <View style={styles.currencyTitleContainer}>
          {SUPPORTED_COINS_PRICING.map(currency => (
            <CurrencyButton
              key={currency}
              onPress={this.handleCurrencyChange(currency)}
              selected={currency === this.state.selectedCurrency}
            >
              {currency}
            </CurrencyButton>
          ))}
        </View>
        <View style={styles.pricingContainer}>
          {!price.requesting && !history.requesting ? (
            <ValueStatement
              title={`${this.state.selectedCurrency} ${t('dashboard.price')}`}
              value={`$${price.price.toFixed(2)}`}
              change={history.change}
              positive={history.positive}
            />
          ) : (
            <Text>...</Text>
          )}
        </View>
        <View style={styles.carouselContainer}>
          <IntervalSelectionChart
            interval={this.state.selectedInterval}
            positive={history.positive || false}
            loading={history.requesting}
            onChangeInterval={this.handleChangeInterval}
            history={history.data}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title={t('actions.send')}
            onPress={this.props.showSendModal}
            color={themeColors.interactivePrimary}
          />
          <Button
            title={t('actions.receive')}
            onPress={this.props.showReceiveModal}
            color={themeColors.interactivePrimary}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    margin: 10,
    fontSize: 30,
  },
  date: {
    marginBottom: 10,
    fontSize: 20,
  },
  currencyTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pricingContainer: {
    flexDirection: 'row',
  },
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 'auto',
    alignItems: 'center',
  },
});

const getThemedStyles = colors => {
  return {
    container: {},
    heading: {
      color: colors.textPrimary,
    },
    date: {
      color: colors.textPrimary,
    },
    text: {
      color: colors.textPrimary,
    },
  };
};
