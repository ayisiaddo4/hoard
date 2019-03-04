import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Linking,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import SectionHeader from 'components/SectionHeader';
import TradeItem from 'components/TradeItem';
import { getCoinMetadata, getInfoUrl } from 'lib/currency-metadata';
import { Intervals } from 'components/GetCurrencyHistory';
import NavigatorService from 'lib/navigator';
import Conditional, { Try, Otherwise } from 'components/Conditional';
import Card from 'components/Card';
import T from 'components/Typography';
import { Layout } from 'components/Base';
import Swipeable from 'react-native-swipeable';
import { TYPE_SEND, TYPE_REQUEST } from 'screens/SendRequest/constants';
import { NOTIFICATION_FLOW_TYPE_CONTACT_FULFILLMENT } from 'containers/Notifications/constants';
import { t } from 'translations/i18n';
import { colors } from 'styles';

const commonTransactionProps = {
  type: PropTypes.oneOf([TYPE_SEND, TYPE_REQUEST]).isRequired,
  date: PropTypes.number.isRequired,
  symbol: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  price: PropTypes.number,
};

export default class CoinInformation extends React.Component {
  static propTypes = {
    pricing: PropTypes.shape({
      price: PropTypes.shape({
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    }).isRequired,
    contactTransactions: PropTypes.arrayOf(
      PropTypes.shape({
        ...commonTransactionProps,
        details: PropTypes.shape({
          uid: PropTypes.string.isRequired,
        }).isRequired,
      })
    ).isRequired,
    transactions: PropTypes.arrayOf(
      PropTypes.shape({
        ...commonTransactionProps,
        details: PropTypes.shape({
          hash: PropTypes.string.isRequired,
        }).isRequired,
      })
    ).isRequired,
    wallet: PropTypes.shape({
      id: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired,
      balance: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    }),
    isSignedIn: PropTypes.bool,
    updateTransaction: PropTypes.func.isRequired,
    showReceiveModal: PropTypes.func.isRequired,
    showSendModal: PropTypes.func.isRequired,
    getCurrencyHistory: PropTypes.func.isRequired,
    cancelContactTransaction: PropTypes.func.isRequired,
    deleteWallet: PropTypes.func.isRequired,
    notificationRecieved: PropTypes.func.isRequired,
    notificationDismissed: PropTypes.func.isRequired,
  };

  state = {
    selected: null,
    hasDismissedReviewModal: false,
    deleteOnDismount: false,
  };

  componentWillUpdate(props) {
    if (
      props.pricing != this.props.pricing ||
      props.transactions.length != this.props.transactions.length ||
      props.wallet != this.props.wallet
    ) {
      return true;
    }

    return false;
  }

  componentWillMount() {
    const { wallet, navigation, getCurrencyHistory } = this.props;

    if (wallet.additionalInfo && wallet.additionalInfo.reviewOnly) {
      const metadata = getCoinMetadata(wallet.symbol);
      const { notification } = this.props.notificationRecieved({
        type: 'neutral',
        title: t('coin_informtion.review_only_notification_title', {
          full_name: metadata.fullName,
        }),
        content: t('coin_informtion.review_only_notification_content'),
        onDismiss: () => {
          this.setState({ hasDismissedReviewModal: true });
          this.props.notificationDismissed(notification);
        },
        actions: [
          {
            title: 'Cancel',
            onPress: () => {
              this.setState({ hasDismissedReviewModal: true });
              this.props.notificationDismissed(notification);
            },
          },
          {
            title: 'Delete',
            onPress: () =>
              this.setState({ deleteOnDismount: true }, () => {
                this.props.notificationDismissed(notification);
                NavigatorService.back();
              }),
          },
        ],
      });
    }

    navigation.setParams({
      title: wallet.symbol,
      leftAction: 'back',
    });
    getCurrencyHistory(wallet.symbol, {
      limit: 2,
      interval: Intervals.all,
    });
  }

  componentWillUnmount() {
    if (this.state.deleteOnDismount) {
      this.props.deleteWallet(this.props.wallet.id);
    }
  }

  handleCancelContactTransaction = transaction => () =>
    this.props.cancelContactTransaction(transaction);

  handleFulfillContactTransaction = transaction => () => {
    this.props.startNotificationFlow({
      flowType: NOTIFICATION_FLOW_TYPE_CONTACT_FULFILLMENT,
      transaction,
    });
  };

  handleSelect = selectedHash => () => {
    const selectedTx = this.props.transactions.find(
      tx => tx.details.hash === selectedHash
    );
    const to = getInfoUrl(selectedTx.symbol, selectedTx.details.hash);

    if (to) {
      Linking.openURL(to).catch(err => {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.error('An error occurred', err);
        }
      });
    }
  };

  handleView = () => {
    NavigatorService.navigate('ViewAddress', {
      wallet: this.props.wallet.id,
    });
  };

  handleRequest = () => {
    NavigatorService.navigate('SendRequest', {
      type: TYPE_REQUEST,
      wallet: this.props.wallet.id,
    });
  };

  handleSend = () => {
    NavigatorService.navigate('SendRequest', {
      type: TYPE_SEND,
      wallet: this.props.wallet.id,
    });
  };

  renderHeader = () => {
    const { pricing, wallet, isSignedIn, contactTransactions } = this.props;
    const metadata = getCoinMetadata(wallet.symbol);
    const price = pricing.price.price || 0;
    const formattedBalance = wallet.balance
      .toString()
      .match(new RegExp(`^\\d+.?(\\d{0,${metadata.pointsOfPrecision}})?`))[0];

    const reviewOnly =
      wallet.additionalInfo && wallet.additionalInfo.reviewOnly;

    const actionButtonStyle = reviewOnly
      ? [styles.actionButton, { opacity: 0.75 }]
      : styles.actionButton;
    return (
      <View style={styles.container}>
        <T.Heading style={styles.heading}>{metadata.fullName}</T.Heading>
        <Card
          icon={metadata.icon}
          colors={metadata.colors}
          title={formattedBalance}
          walletsToChart={[wallet]}
          subtitle={`$${(wallet.balance * price).toFixed(2)}`}
        />
        <Conditional>
          <Try condition={reviewOnly && this.state.hasDismissedReviewModal}>
            <View style={styles.reviewOnlyContainer}>
              <Image
                source={require('assets/exclamation-circle.png')}
                style={styles.reviewOnlyIcon}
              />
              <View style={styles.reviewOnlyBody}>
                <T.SubHeading style={styles.reviewOnlyHeader}>
                  {t('coin_informtion.review_only_header')}
                </T.SubHeading>
                <T.Light style={styles.reviewOnlyContent}>
                  {t('coin_informtion.review_only_content')}
                </T.Light>
              </View>
            </View>
          </Try>
          <Otherwise>
            <View style={styles.actionButtonContainer}>
              <TouchableOpacity
                onPress={this.handleSend}
                style={actionButtonStyle}
                disabled={reviewOnly}
              >
                <View style={styles.actionButtonView}>
                  <Image
                    style={styles.image}
                    source={require('assets/send.png')}
                  />
                  <T.Small style={styles.actionButtonText}>
                    {t('actions.send')}
                  </T.Small>
                </View>
              </TouchableOpacity>
              <Try condition={isSignedIn}>
                <TouchableOpacity
                  onPress={this.handleRequest}
                  style={actionButtonStyle}
                  disabled={reviewOnly}
                >
                  <View style={styles.actionButtonView}>
                    <Image
                      style={styles.image}
                      source={require('assets/request.png')}
                    />
                    <T.Small style={styles.actionButtonText}>
                      {t('actions.request')}
                    </T.Small>
                  </View>
                </TouchableOpacity>
              </Try>
              <TouchableOpacity
                onPress={this.handleView}
                style={actionButtonStyle}
                disabled={reviewOnly}
              >
                <View style={styles.actionButtonView}>
                  <Image
                    style={styles.image}
                    source={require('assets/scan.png')}
                  />
                  <T.Small style={styles.actionButtonText}>
                    {t('actions.view')}
                  </T.Small>
                </View>
              </TouchableOpacity>
            </View>
          </Otherwise>
        </Conditional>
        <Try condition={contactTransactions.length > 0}>
          <Fragment>
            <SectionHeader style={styles.sectionHeader}>
              {t('coin_informtion.pending_transactions')}
            </SectionHeader>
            <View style={styles.contactTransactionsContainer}>
              {contactTransactions.map(item => (
                <Swipeable
                  key={item.details.uid}
                  rightButtons={[
                    <TouchableOpacity
                      onPress={this.handleCancelContactTransaction(item)}
                      style={styles.walletAction}
                      key={'actionCancel'}
                    >
                      <View style={styles.walletActionContainer}>
                        <Image
                          style={styles.walletActionImage}
                          source={require('assets/cancel.png')}
                        />
                        <Text style={styles.walletActionText}>
                          {t('actions.cancel')}
                        </Text>
                      </View>
                    </TouchableOpacity>,
                    item.type === TYPE_REQUEST ? (
                      <TouchableOpacity
                        onPress={this.handleFulfillContactTransaction(item)}
                        style={styles.walletAction}
                        key={'actionRequest'}
                      >
                        <View style={styles.walletActionContainer}>
                          <Image
                            style={styles.walletActionImage}
                            source={require('assets/request.png')}
                          />
                          <Text style={styles.walletActionText}>
                            {t('actions.request')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={this.handleFulfillContactTransaction(item)}
                        style={styles.walletAction}
                        key={'actionSend'}
                      >
                        <View style={styles.walletActionContainer}>
                          <Image
                            style={styles.walletActionImage}
                            source={require('assets/send.png')}
                          />
                          <Text style={styles.walletActionText}>
                            {t('actions.send')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ),
                  ]}
                  rightButtonWidth={95}
                >
                  <TradeItem
                    wallet={wallet}
                    transaction={item}
                    onUpdate={this.props.updateTransaction}
                    selected={this.state.selected === item.details.uid}
                  />
                </Swipeable>
              ))}
            </View>
          </Fragment>
        </Try>

        <SectionHeader style={styles.sectionHeader}>
          Recent Activity
        </SectionHeader>
      </View>
    );
  };

  keyExtractor = t => t.details.hash;

  renderTradeItem = ({ item }) => (
    <TouchableOpacity onPress={this.handleSelect(item.details.hash)}>
      <TradeItem
        wallet={this.props.wallet}
        transaction={item}
        onUpdate={this.props.updateTransaction}
        selected={this.state.selected === item.details.hash}
      />
    </TouchableOpacity>
  );

  render() {
    const { transactions } = this.props;

    return (
      <Layout preload={true}>
        <FlatList
          style={[styles.flex, styles.scrollView]}
          ListHeaderComponent={this.renderHeader}
          data={transactions}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderTradeItem}
        />
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: 'transparent',
  },
  container: {
    paddingTop: 40,
    padding: 15,
    flexDirection: 'column',
  },
  heading: {
    marginBottom: 20,
    color: 'white',
  },
  image: {
    width: 25,
    height: 25,
    marginBottom: 8.5,
    resizeMode: 'contain',
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
  },
  actionButton: {
    justifyContent: 'center',
    marginHorizontal: 25,
  },
  actionButtonView: {
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 11,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 13,
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff"
  },
  contactTransactionsContainer: {
    marginHorizontal: -15,
    marginBottom: 20,
  },
  walletAction: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 15,
  },
  walletActionContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    padding: 5,
    width: 75,
  },
  walletActionImage: {
    height: 20,
    width: 20,
    marginBottom: 5,
    resizeMode: 'contain',
  },
  walletActionText: {
    color: '#fff',
    fontSize: 12,
  },
  reviewOnlyContainer: {
    marginVertical: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: colors.active,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reviewOnlyIcon: {
    height: 50,
    width: 50,
    resizeMode: 'contain',
    marginRight: 15,
  },
  reviewOnlyBody: {
    flex: 1,
  },
  reviewOnlyHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
  reviewOnlyContent: {
    fontSize: 12,
    color: 'white',
  },
});
