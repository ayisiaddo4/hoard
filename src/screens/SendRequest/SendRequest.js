import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Validator from 'wallet-address-validator';
import Config from 'react-native-config';
import { Alert, Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import memoize from 'lodash/memoize';

import { colors, calculateHitSlop } from 'styles';
import Contact from './Contact';
import Scene from 'components/Scene';
import T from 'components/Typography';
import { t } from 'translations/i18n';
import UnderlineInput from 'components/UnderlineInput';
import LoadingSpinner from 'components/LoadingSpinner';
import Button from 'components/Button';
import SelectableImageHeader from 'components/SelectableImageHeader';
import { getCoinMetadata } from 'lib/currency-metadata';
import { formatDecimalInput } from 'lib/formatters';
import Conditional, { Try, Otherwise } from 'components/Conditional';
import {
  TYPE_SEND,
  TYPE_REQUEST,
  RECIPIENT_TYPE_ADDRESS,
  RECIPIENT_TYPE_OTHER,
} from 'screens/SendRequest/constants';
import { SYMBOL_BOAR, SYMBOL_ETH } from 'containers/App/constants';
import Icon from 'components/Icon';
import NavigatorService from 'lib/navigator';
import api from 'lib/api';

import { convertCurrency, SOLVE_FOR } from 'lib/currency-helpers';

const clearSize = 20;
const clearHitSlop = calculateHitSlop(clearSize);
const amountFormatter = formatDecimalInput(8);

const initialState = {
  amount: '',
  fiat: '',
  recipient: '',
  recipientAddress: '',
  recipientType: RECIPIENT_TYPE_ADDRESS,
  selectedId: null,
};

export default class SendRequest extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          type: PropTypes.oneOf([TYPE_SEND, TYPE_REQUEST]),
          wallet: PropTypes.string,
        }),
      }),
    }),
    wallets: PropTypes.arrayOf(
      PropTypes.shape({
        balance: PropTypes.number.isRequired,
        id: PropTypes.string.isRequired,
        symbol: PropTypes.string.isRequired,
      })
    ).isRequired,
    prices: PropTypes.objectOf(PropTypes.number),
    tradingPair: PropTypes.string,
    emailAddress: PropTypes.string,
    isSignedIn: PropTypes.bool.isRequired,
    getCurrencyPrice: PropTypes.func.isRequired,
    recordContactTransaction: PropTypes.func.isRequired,
    sendFunds: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const params = props.navigation.state && props.navigation.state.params || {};
    const {
      wallet: selectedId,
      recipient = initialState.recipient,
      recipientAddress = initialState.recipientAddress,
      recipientType = initialState.recipientType,
      amount = initialState.amount,
      type: transactionType = initialState.transactionType
    } = params;

    let completionAction = () => {};
    if (transactionType === TYPE_SEND) {
      completionAction = this.send;
    } else if (transactionType === TYPE_REQUEST) {
      completionAction = this.request;
    }

    this.state = {
      ...initialState,
      transactionType,
      completionAction,
      amount,
      recipient,
      recipientAddress,
      selectedId,
      recipientType: recipientType || transactionType === TYPE_SEND
        ? RECIPIENT_TYPE_ADDRESS
        : RECIPIENT_TYPE_OTHER,
    };
  }

  componentDidMount() {
    this.fetchPrice();
  }

  componentWillReceiveProps(newProps) {
    const selectedWallet = this.props.wallets.find(
      wallet => wallet.id === this.state.selectedId
    );

    const oldPrice = this.state.prices && selectedWallet && this.state.prices[selectedWallet.symbol];

    if (!oldPrice && this.state.amount && selectedWallet && newProps.prices[selectedWallet.symbol]) {
      this.handleChangeAmount(this.state.amount);
    }
  }

  fetchPrice = () => {
    const selectedWallet = this.props.wallets.find(
      wallet => wallet.id === this.state.selectedId
    );

    if (selectedWallet) {
      this.props.getCurrencyPrice(selectedWallet.symbol);
    }
  };

  handleChangeAmount = value => {
    const selectedWallet = this.props.wallets.find(
      wallet => wallet.id === this.state.selectedId
    );

    const { destination } = convertCurrency({
      source: {
        pair: this.props.tradingPair,
        price: this.props.prices[selectedWallet.symbol],
        amount: Number(value),
      },
      destination: {
        pair: this.props.tradingPair,
        price: 1,
        amount: SOLVE_FOR,
      },
    });

    this.setState({
      fiat: amountFormatter(destination.amount),
      amount: amountFormatter(value),
    });
  };

  handleChangeFiat = value => {
    const selectedWallet = this.props.wallets.find(
      wallet => wallet.id === this.state.selectedId
    );

    const { destination } = convertCurrency({
      source: {
        pair: this.props.tradingPair,
        price: 1,
        amount: Number(value),
      },
      destination: {
        pair: this.props.tradingPair,
        price: this.props.prices[selectedWallet.symbol],
        amount: SOLVE_FOR,
      },
    });

    this.setState({
      fiat: amountFormatter(value),
      amount: amountFormatter(destination.amount),
    });
  };

  handleOnPressRecipient = () => NavigatorService.navigate('RecipientSelection', {
    transactionType: this.state.transactionType,
    isSignedIn: this.props.isSignedIn,
    onChangeRecipient: this.handleChangeRecipient
  });

  handleChangeRecipient = ({recipientType, recipient}) => this.setState({recipientType, recipient, recipientAddress: recipientType === RECIPIENT_TYPE_ADDRESS ? recipient : ''});

  handleOnPressCurrency = () => NavigatorService.navigate('CurrencyModal', {
    onChangeCurrency: this.handleChangeCurrency,
    selectedId: this.state.selectedId,
  });

  handleChangeCurrency = value =>
    this.setState(
      {
        amount: '',
        fiat: '',
        selectedId: value
      },
      this.fetchPrice
    );

  validate({ amount, selectedId, recipient, recipientType, transactionType }) {
    const numAmount = Number(amount);
    const selectedWallet = this.props.wallets.find(
      wallet => wallet.id === selectedId
    );

    // Require funds source
    if (!selectedId) {
      if (transactionType == TYPE_SEND) {
        Alert.alert(t('send_request.select_wallet_send'));
      }
      if (transactionType == TYPE_REQUEST) {
        Alert.alert(t('send_request.select_coin_request'));
      }
      return false;
    }
    // Require funds amount
    else if (!numAmount) {
      if (transactionType == TYPE_SEND) {
        Alert.alert(t('send_request.input_amount_to_send'));
      }
      if (transactionType == TYPE_REQUEST) {
        Alert.alert(t('send_request.input_amount_to_request'));
      }
      return false;
    }

    // Require sufficient balance
    else if (
      transactionType === TYPE_SEND &&
      numAmount > selectedWallet.balance
    ) {
      Alert.alert(t('send_request.insufficient_balance'));
      return false;
    }

    // Require a recipient
    else if (recipientType === RECIPIENT_TYPE_ADDRESS && !recipient) {
      Alert.alert(t('send_request.missing_recipient'));
      return false;
    }

    // Require valid recipient address
    else if (
      recipientType === RECIPIENT_TYPE_ADDRESS &&
      !Validator.validate(
        recipient,
        selectedWallet.symbol === SYMBOL_BOAR
          ? SYMBOL_ETH
          : selectedWallet.symbol,
        Config.CURRENCY_NETWORK_TYPE === 'main' ? 'prod' : 'testnet'
      )
    ) {
      Alert.alert(t('send_request.invalid_address', { symbol: selectedWallet.symbol }));
      return false;
    }

    // Require other recipient address
    else if (recipientType === RECIPIENT_TYPE_OTHER && !recipient) {
      if (transactionType == TYPE_SEND) {
        Alert.alert(t('send_request.other_no_recipient_send'));
      }
      if (transactionType == TYPE_REQUEST) {
        Alert.alert(t('send_request.other_no_recipient_request'));
      }
      return false;
    }

    // Valid verification;
    else {
      return true;
    }
  }

  send = async () => {
    if (this.validate(this.state)) {
      let { recipientAddress } = this.state;
      const selectedWallet = this.props.wallets.find(
        wallet => wallet.id === this.state.selectedId
      );
      if (this.state.recipientType === RECIPIENT_TYPE_OTHER && !recipientAddress) {
        try {
          const { symbol, publicAddress } = selectedWallet;
          const recipientValue = this.getValueFromRecipient(this.state.recipient);
          const contact = this.state.recipient;
          const amount = Number(this.state.amount);

          const response = await api.post(`${Config.EREBOR_ENDPOINT}/contacts/transaction`, {
            sender: publicAddress,
            amount,
            recipient: recipientValue,
            currency: symbol,
          });

          if (response.success) {
            this.props.recordContactTransaction({
              type: TYPE_SEND,
              date: Date.now(),
              symbol: symbol,
              to: recipientValue,
              from: publicAddress,
              amount,
              price: Number(this.state.fiat),
              contact,
              details: {
                ...response,
                uid: response.transaction_uid,
              }
            });

            NavigatorService.navigate('TransactionStatus', {
              isContactTransaction: true,
              id: response.transaction_uid,
              type: TYPE_SEND,
            });
          } else {
            recipientAddress = response.public_key;
          }
        } catch (e) {
          Alert.alert(
            `${t('requests.apologetic_interjection_of_mild_dismay')} ${e.message}: ${e.errors && e.errors[0] && e.errors[0].message}`
          );
        }
      }

      if (recipientAddress) {
        let transaction_uid;
        const params = this.props.navigation.state.params || {};
        if (recipientAddress === params.recipientAddress && params.transaction_uid) {
          transaction_uid = params.transaction_uid;
        }

        const action = this.props.sendFunds(
          this.state.selectedId,
          recipientAddress,
          Number(this.state.amount),
          transaction_uid
        );

        NavigatorService.navigate('TransactionStatus', {
          id: action.id,
          type: TYPE_SEND,
        });
      }
    }
  };

  request = async () => {
    if (this.validate(this.state)) {
      const selectedWallet = this.props.wallets.find(
        wallet => wallet.id === this.state.selectedId
      );
      try {
        const { symbol } = selectedWallet;
        const { emailAddress } = this.props;
        const recipientValue = this.getValueFromRecipient(this.state.recipient);
        const contact = this.state.recipient;
        const amount = Number(this.state.amount);

        const response = await api.post(`${Config.EREBOR_ENDPOINT}/request_funds`, {
          email_address: emailAddress,
          amount,
          recipient: recipientValue,
          currency: symbol,
        });

        this.props.recordContactTransaction({
          type: TYPE_REQUEST,
          date: Date.now(),
          symbol: symbol,
          to: emailAddress,
          from: recipientValue,
          amount,
          price: Number(this.state.fiat),
          contact,
          details: {
            ...response,
            uid: response.transaction_uid,
          }
        });

        NavigatorService.navigate('TransactionStatus', {
          isContactTransaction: true,
          id: response.transaction_uid,
          type: TYPE_REQUEST,
        });
      } catch (e) {
        Alert.alert(
          `${t('requests.apologetic_interjection_of_mild_dismay')} ${e.message}: ${e.errors && e.errors[0] && e.errors[0].message}`
        );
      }
    }
  };

  clearValue = memoize(stateKey => () => {
    this.setState({ [stateKey]: '' });
  });

  getValueFromRecipient(recipient) {
    if (typeof recipient === 'object') {
      return [
        recipient.emailAddresses
          && recipient.emailAddresses[0]
          && recipient.emailAddresses[0].email,
        recipient.phoneNumbers
          && recipient.phoneNumbers[0]
          && recipient.phoneNumbers[0].number
      ].find(v => v);
    } else {
      return recipient;
    }
  }

  render() {
    const { wallets, prices } = this.props;
    const { amount, fiat, selectedId } = this.state;

    const selectedWallet = wallets.find(wallet => wallet.id === selectedId);
    const isLoadingPrice = !prices[selectedWallet.symbol];

    const currencyDisplay = selectedWallet && {
      title: getCoinMetadata(selectedWallet.symbol).fullName,
      subtitle: selectedWallet.balance,
      image: getCoinMetadata(selectedWallet.symbol).image,
    };

    let title = '';
    let recipientEmptyText = '';
    if (this.state.transactionType === TYPE_SEND) {
      title = t('send_request.send');
      recipientEmptyText = t('send_request.recipient');
    } else if (this.state.transactionType === TYPE_REQUEST) {
      title = t('send_request.request');
      recipientEmptyText = t('send_request.requesting_from');
    }

    return (
      <Scene preload={false}>
        <View style={styles.flex1}>
          <Conditional>
            <Try condition={isLoadingPrice}>
              <View style={styles.flex1}>
                <View style={styles.loading}>
                  <T.GrayedOut>{t('send_request.loading_prices')}</T.GrayedOut>
                </View>
                <LoadingSpinner />
              </View>
            </Try>
            <Try condition={!wallets.length}>
              <T.GrayedOut>{t('send_request.no_wallets')}</T.GrayedOut>
            </Try>
            <Otherwise>
              <View style={[styles.flex1, styles.contentContainer]}>
                <T.Heading style={styles.subheading}>{title}</T.Heading>
                <View>
                  <TouchableOpacity onPress={this.handleOnPressRecipient}>
                    <View style={styles.recipientContainer}>
                      <Conditional>
                        <Try condition={!!this.state.recipient}>
                          <T.Light style={styles.recipientHeader}>
                            {t('send_request.recipient')}
                          </T.Light>
                        </Try>
                        <Otherwise>
                          <View style={{height: 22}}/>
                        </Otherwise>
                      </Conditional>
                      <View style={styles.recipientContent}>
                        <Conditional>
                          <Try condition={!!this.state.recipient && typeof this.state.recipient === 'object'}>
                            <Contact contact={this.state.recipient} />
                          </Try>
                          <Otherwise>
                            <T.Light style={styles.recipientText}>
                              {this.state.recipient || recipientEmptyText}
                            </T.Light>
                          </Otherwise>
                        </Conditional>
                        <Conditional>
                          <Try condition={!!this.state.recipient}>
                            <TouchableOpacity
                              hitSlop={clearHitSlop}
                              style={styles.action}
                              onPress={this.clearValue('recipient')}
                            >
                              <Icon icon="ios-close-circle" style={{ size: clearSize, color: 'rgba(255,255,255,0.5)' }} />
                            </TouchableOpacity>
                          </Try>
                          <Otherwise>
                            <Image style={styles.recipientChevron} source={require('assets/chevron.png')} />
                          </Otherwise>
                        </Conditional>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                <SelectableImageHeader
                  title={t('send_request.currency_title')}
                  emptyText={t('send_request.currency_empty')}
                  selection={currencyDisplay}
                  onPress={this.handleOnPressCurrency}
                />
                <View style={styles.valueInputs}>
                  <View style={styles.amount}>
                    <UnderlineInput
                      style={styles.input}
                      keyboardType="numeric"
                      label={
                        selectedWallet
                          ? `${t('send_request.enter')} ${selectedWallet.symbol}`
                          : t('send_request.enter_amount')
                      }
                      onChangeText={this.handleChangeAmount}
                      value={amount.toString()}
                    />
                  </View>
                  <View style={styles.fiat}>
                    <UnderlineInput
                      style={styles.input}
                      keyboardType="numeric"
                      label={`${t('send_request.enter')} ${this.props.tradingPair}`}
                      onChangeText={this.handleChangeFiat}
                      value={fiat}
                    />
                  </View>
                </View>
                <Button
                  disabled={!selectedId}
                  onPress={this.state.completionAction}
                >
                  {title}
                </Button>
              </View>
            </Otherwise>
          </Conditional>
        </View>
      </Scene>
    );
  }
}

const styles = StyleSheet.create({
  input: {},
  recipientContainer: {
    paddingVertical: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  recipientHeader: {
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 5,
  },
  recipientContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipientText: {
    color: 'white',
  },
  recipientChevron: {
    resizeMode: 'contain',
    height: 14,
    width: 14,
  },
  action: {
    marginBottom: -10,
  },
  flex1: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 20,
  },
  subheading: {
    justifyContent: 'center',
    color: colors.white,
    marginBottom: 20,
  },
  valueInputs: {
    flexDirection: 'row',
    flex: 1,
    marginBottom: 20,
  },
  amount: {
    flex: 1,
    marginRight: 10,
  },
  fiat: {
    flex: 1,
    marginLeft: 10,
  },
});
