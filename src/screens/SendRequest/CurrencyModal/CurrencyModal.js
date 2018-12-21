import React, { Component, Fragment } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import T from 'components/Typography';
import Modal from 'components/Modal';
import SelectableImageRow from 'components/SelectableImageRow';
import { Try } from 'components/Conditional';
import NavigatorService from 'lib/navigator';
import { getCoinMetadata } from 'lib/currency-metadata';
import memoize from 'lodash/memoize';
import { t } from 'translations/i18n';

const WalletType = PropTypes.shape({
  balance: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
});

export default class CurrencyModal extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          onChangeCurrency: PropTypes.func.isRequired,
          selectedId: PropTypes.string.isRequired,
        }),
      }),
    }),
    wallets: PropTypes.arrayOf(WalletType).isRequired,
    mostUsedWallet: WalletType,
  };

  handleSelectCoin = memoize(value => () => this.handleSubmit(value));

  handleSubmit = value => {
    this.props.navigation.state.params.onChangeCurrency(value);
    NavigatorService.navigate('SendRequest');
  };

  render() {
    const { wallets, mostUsedWallet } = this.props;

    return (
      <Modal title={t('send_request.modals.currency_title')}>
        <T.Light style={styles.text}>
          {t('send_request.modals.currency_heading')}
        </T.Light>
        <Try condition={!!this.props.mostUsedWallet}>
          <Fragment>
            <T.SubHeading style={styles.subheading}>
              {t('send_request.modals.currency_subheading_most_used')}
            </T.SubHeading>
            <SelectableImageRow
              image={
                mostUsedWallet && getCoinMetadata(mostUsedWallet.symbol).image
              }
              onPress={
                mostUsedWallet && this.handleSelectCoin(mostUsedWallet.id)
              }
              selected={
                mostUsedWallet &&
                this.props.navigation.state.params.selectedId ===
                  mostUsedWallet.id
              }
              subtitle={
                mostUsedWallet &&
                `${mostUsedWallet.symbol}    ${mostUsedWallet.balance}`
              }
              title={
                mostUsedWallet &&
                getCoinMetadata(mostUsedWallet.symbol).fullName
              }
            />
          </Fragment>
        </Try>
        <T.SubHeading style={styles.subheading}>
          {t('send_request.modals.currency_subheading_all')}
        </T.SubHeading>
        <ScrollView bounces={false}>
          {wallets.map(wallet => {
            const metadata = getCoinMetadata(wallet.symbol);
            return (
              <SelectableImageRow
                key={wallet.id}
                image={metadata.image}
                onPress={this.handleSelectCoin(wallet.id)}
                selected={
                  this.props.navigation.state.params.selectedId === wallet.id
                }
                subtitle={`${wallet.symbol}    ${wallet.balance}`}
                title={metadata.fullName}
              />
            );
          })}
        </ScrollView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: 'white',
  },
  subheading: {
    marginTop: 20,
    color: 'white',
    fontWeight: '500',
  },
});
