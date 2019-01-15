import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Button from 'components/Button';
import Card from 'components/Card';
import WalletListEntry, { ENTRY_STATUS } from './WalletListEntry';
import { Layout } from 'components/Base';
import { getCoinMetadata } from 'lib/currency-metadata';
import Storage from 'lib/storage';
import { SUPPORTED_COINS_WALLET } from 'containers/App/constants';
import { TYPE_SEND, TYPE_REQUEST } from 'screens/SendRequest/constants';
import { dimensions } from 'styles';
import Swipeable from 'react-native-swipeable';
import NavigatorService from 'lib/navigator';
import Config from 'react-native-config';
import T from 'components/Typography';
import { t } from 'translations/i18n';

class SwipableItem extends React.Component {
  static propTypes = {
    isSignedIn: PropTypes.bool,
    wallet_id: PropTypes.string,
    onSwipeStart: PropTypes.func,
    children: PropTypes.node,
  };

  handleView = () => {
    NavigatorService.navigate('ViewAddress', {
      wallet: this.props.wallet_id,
    });
  };

  handleRequest = () => {
    NavigatorService.navigate('SendRequest', {
      type: TYPE_REQUEST,
      wallet: this.props.wallet_id,
    });
  };

  handlePay = () => {
    NavigatorService.navigate('SendRequest', {
      type: TYPE_SEND,
      wallet: this.props.wallet_id,
    });
  };

  render() {
    const PAY_ICON = require('assets/send.png');
    const REQUEST_ICON = require('assets/request.png');
    const VIEW_ICON = require('assets/scan.png');

    const numButtons = this.props.isSignedIn ? 3 : 2;
    const horizontalPaddingList = 40;
    const horizontalPaddingImage = 20;
    const imageWidth = 30;
    const offset = horizontalPaddingImage + horizontalPaddingList + imageWidth;
    const buttonWidth = (dimensions.width - offset) / numButtons;

    const rightButtons = [
      <TouchableOpacity
        onPress={this.handlePay}
        style={styles.walletAction}
        key={'actionPay'}
      >
        <View style={styles.walletActionContainer}>
          <Image style={styles.walletActionImage} source={PAY_ICON} />
          <Text style={styles.walletActionText}>{t('actions.pay')}</Text>
        </View>
      </TouchableOpacity>,

      this.props.isSignedIn && (
        <TouchableOpacity
          onPress={this.handleRequest}
          style={styles.walletAction}
          key={'actionRequest'}
        >
          <View style={styles.walletActionContainer}>
            <Image style={styles.walletActionImage} source={REQUEST_ICON} />
            <Text style={styles.walletActionText}>{t('actions.request')}</Text>
          </View>
        </TouchableOpacity>
      ),

      <TouchableOpacity
        onPress={this.handleView}
        style={styles.walletAction}
        key={'actionView'}
      >
        <View style={styles.walletActionContainer}>
          <Image style={styles.walletActionImage} source={VIEW_ICON} />
          <Text style={styles.walletActionText}>{t('actions.view')}</Text>
        </View>
      </TouchableOpacity>,
    ].filter(v => v);

    return (
      <Swipeable
        onSwipeStart={this.props.onSwipeStart}
        rightButtons={rightButtons}
        rightButtonWidth={buttonWidth}
      >
        {this.props.children}
      </Swipeable>
    );
  }
}

const HAS_DISMISSED_TESTNET_MODAL_STORAGE_KEY =
  'HAS_DISMISSED_TESTNET_MODAL_STORAGE_KEY';

class Wallet extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    wallets: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    hasMnemonic: PropTypes.bool,
    isSignedIn: PropTypes.bool,
    hasAvailableCoins: PropTypes.bool,
    totalHoldings: PropTypes.number,
    prices: PropTypes.objectOf(
      PropTypes.shape({
        price: PropTypes.number,
        requesting: PropTypes.bool,
        successful: PropTypes.bool,
      })
    ),
    getCurrencyPrice: PropTypes.func.isRequired,
    notificationRecieved: PropTypes.func.isRequired,
  };

  state = {
    swipedWallet: null,
    hasDismissedModal: Config.CURRENCY_NETWORK_TYPE === 'main',
    testnetWarning: null,
  };

  componentDidMount() {
    if (Config.CURRENCY_NETWORK_TYPE !== 'main') {
      Storage.get(HAS_DISMISSED_TESTNET_MODAL_STORAGE_KEY).then(value => {
        if (value) {
          return;
        }

        setTimeout(() => {
          const { notification } = this.props.notificationRecieved({
            type: 'error',
            title: t('testnet.warning_title'),
            content: t('testnet.warning_description'),
            icon: require('assets/exclamation-circle.png'),
            onDismiss: this.handleDismissTestnetWarning,
            actions: [
              {
                title: t('testnet.warning_dismiss'),
                onPress: this.handleDismissTestnetWarning,
              },
            ],
          });

          this.setState({ testnetWarning: notification });
        }, 1000);
      });
    }

    SUPPORTED_COINS_WALLET.map(symbol => this.props.getCurrencyPrice(symbol));
  }

  handleNavigateToCoinInfo = (id, coin) => () => {
    if (this.state.swipedWallet) {
      this.state.swipedWallet.recenter();
    }
    this.props.navigation.navigate('CoinInformation', { id, coin });
  };

  handleMnemonicGenerate = () => {
    this.props.navigation.navigate('Mnemonic');
  };

  handleWalletTrack = () => {
    this.props.navigation.navigate('Track');
  };

  handleWalletImport = () => {
    this.props.navigation.navigate('Import');
  };

  handleWalletSwipe = (evt, gestureState, swipedWallet) => {
    if (this.state.swipedWallet) {
      this.state.swipedWallet.recenter();
    }
    this.setState({ swipedWallet });
  };

  handleScroll = () => {
    if (this.state.swipedWallet) {
      this.state.swipedWallet.recenter();
      this.setState({ swipedWallet: null });
    }
  };

  handleDismissTestnetWarning = async () => {
    await Storage.set(HAS_DISMISSED_TESTNET_MODAL_STORAGE_KEY, true);

    this.props.notificationDismissed(this.state.testnetWarning);
  };

  renderActionButtons() {
    const buttons = [];

    if (this.props.hasMnemonic) {
      if (this.props.hasAvailableCoins) {
        buttons.push({
          type: 'base',
          onPress: this.handleWalletTrack,
          text: t('wallet.track_coin'),
        });
      }

      // disabled for MVP
      /* buttons.push({
       *   type: 'text',
       *   onPress: this.handleWalletImport,
       *   text: 'import wallet',
       *   style: {
       *     marginTop: 20,
       *     marginBottom: 5
       *   }
       * });*/
    } else {
      buttons.push({
        type: 'secondary',
        onPress: this.handleMnemonicGenerate,
        text: t('wallet.make_mnemonic'),
      });
    }

    return (
      <View style={styles.footerContainer}>
        {buttons.map(({ style, type, onPress, text, ...rest }) => (
          <Button
            key={text}
            style={style}
            type={type}
            onPress={onPress}
            {...rest}
          >
            {text}
          </Button>
        ))}
      </View>
    );
  }

  render() {
    return (
      <Layout preload={true}>
        <Card
          colors={['#00A073', '#007982']}
          title={t('wallet.my_balance')}
          subtitle={`$${this.props.totalHoldings.toFixed(2)}`}
          walletsToChart={this.props.wallets}
          style={{
            maxHeight: 180,
            margin: 20,
          }}
        />
        <ScrollView
          contentContainerStyle={styles.scrollview}
          onScroll={this.handleScroll}
          bounces={false}
        >
          {this.props.wallets.map(wallet => {
            const {
              balance,
              balance_requesting,
              balance_successful,
              symbol,
              publicAddress,
              id,
              imported,
            } = wallet;

            const {
              requesting: price_requesting,
              successful: price_successful,
              price,
            } = this.props.prices[symbol];

            const balanceStatus = balance_requesting
              ? ENTRY_STATUS.LOADING
              : balance_successful
              ? ENTRY_STATUS.SUCCESSFUL
              : ENTRY_STATUS.ERROR;
            const priceStatus = price_requesting
              ? ENTRY_STATUS.LOADING
              : price_successful
              ? ENTRY_STATUS.SUCCESSFUL
              : ENTRY_STATUS.ERROR;

            return (
              <SwipableItem
                key={id}
                wallet_id={id}
                onSwipeStart={this.handleWalletSwipe}
                isSignedIn={this.props.isSignedIn}
              >
                <WalletListEntry
                  name={getCoinMetadata(symbol).fullName}
                  symbol={symbol}
                  balance={balance}
                  balanceStatus={balanceStatus}
                  change={'0%'}
                  price={price}
                  priceStatus={priceStatus}
                  publicAddress={publicAddress}
                  imported={imported}
                  onPress={this.handleNavigateToCoinInfo(id, symbol)}
                />
              </SwipableItem>
            );
          })}
        </ScrollView>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  scrollview: {
    flexGrow: 1,
  },
  footerContainer: {
    marginTop: 'auto',
    padding: 15,
  },
  walletAction: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginVertical: 10,
  },
  walletActionContainer: {
    margin: 10,
    padding: 5,
    flex: 1,
    flexDirection: 'column',
    width: 75,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletActionImage: {
    height: 20,
    width: 20,
    marginBottom: 5,
  },
  walletActionText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default Wallet;
