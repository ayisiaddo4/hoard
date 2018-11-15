import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import Button from 'components/Button';
import T from 'components/Typography';
import { t } from 'translations/i18n';
import { SUPPORTED_COINS_WALLET } from 'containers/App/constants';
import SelectableImageList from 'components/SelectableImageList';
import { getCoinMetadata } from 'lib/currency-metadata';
import NavigatorService from 'lib/navigator';

export default class Step1 extends Component {
  static propTypes = {
    saveAndContinue: PropTypes.func.isRequired,
    coins: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  static defaultProps = {
    coins: SUPPORTED_COINS_WALLET,
  };

  state = {
    selectedCoin: null,
  };

  handleClick = selectedCoin => () => {
    this.setState({ selectedCoin });
  };

  handleDone = () => {
    this.props.saveAndContinue(this.state.selectedCoin);
  };

  handleCancel = () => {
    NavigatorService.navigate('Wallet');
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <T.Heading style={styles.headingStyle}>
            {t('wallet.select_coin')}
          </T.Heading>
        </View>
        <View style={styles.bodyContainer}>
          <SelectableImageList
            items={this.props.coins.map(symbol => {
              const metadata = getCoinMetadata(symbol);

              return {
                image: metadata.image,
                onPress: this.handleClick(symbol),
                selected: this.state.selectedCoin === symbol,
                subtitle: symbol,
                title: metadata.fullName,
              };
            })}
          />
        </View>
        <View style={styles.footerContainer}>
          <Button
            type="primary"
            disabled={!this.state.selectedCoin}
            onPress={this.handleDone}
            style={{ overflow: 'hidden' }}
          >
            {t('actions.next')}
          </Button>
          <Button
            style={styles.cancelButton}
            type="text"
            onPress={this.handleCancel}
          >
            {t('actions.cancel')}
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#223252',
  },
  headingStyle: {
    color: '#ffffff',
  },
  bodyContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 0,
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 10,
  },
});
