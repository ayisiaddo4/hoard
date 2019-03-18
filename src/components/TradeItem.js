import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TYPE_SEND } from 'screens/SendRequest/constants';
import { formatDecimalInput } from 'lib/formatters';
import { getCoinMetadata } from 'lib/currency-metadata';
import { toTitleCase } from 'lib/string-helpers';
import ListItem from 'components/ListItem';

const trimAddress = address => {
  if (address && address.length > 20) {
    return [
      address.substring(0, 3),
      '...',
      address.substring(address.length - 3),
    ].join('');
  } else {
    return address;
  }
};

const creation = 'Created Contract';
const send = 'Sent';
const receive = 'Received';

const otherWalletKeyForType = {
  [creation]: 'creates',
  [send]: 'to',
  [receive]: 'from',
};

const isTradeTitle = {
  [send]: 'Sold',
  [receive]: 'Bought',
};

const actionIcon = {
  [send]: require('assets/send.png'),
  [receive]: require('assets/request.png'),
};

class TradeItem extends Component {
  static propTypes = {
    onUpdate: PropTypes.func.isRequired,
  };

  constructor(props) {
    super();

    const tradePrice = props.transaction.fiatTrade
      ? props.transaction.tradePrice
      : props.transaction.price;

    // eslint-disable-next-line immutable/no-mutation
    this.state = {
      fiatTrade: props.transaction.fiatTrade,
      tradePrice: tradePrice && tradePrice.toFixed(2),
      trimAmount: 0,
    };
  }

  handleToggleIsTrade = () =>
    this.setState({ fiatTrade: !this.state.fiatTrade });
  handleChangeTradePrice = tradePrice =>
    this.setState({
      tradePrice: formatDecimalInput(2)(tradePrice.replace('$', '')),
    });

  handleUpdate = () => {
    const { tradePrice, fiatTrade } = this.state;

    this.props.onUpdate({
      ...this.props.transaction,
      tradePrice: Number(tradePrice),
      fiatTrade,
    });
  };

  handleAmountLayout = e => {
    const height = e.nativeEvent.layout.height;
    if (height > 30) {
      this.setState(({ trimAmount }) => ({
        trimAmount: trimAmount + 1,
      }));
    }
  };

  render() {
    const { transaction } = this.props;
    const transactionType = transaction.details.creates
      ? creation
      : transaction.type === TYPE_SEND
      ? send
      : receive;

    const tradeTitle = transaction.fiatTrade
      ? isTradeTitle[transactionType]
      : transaction.details.status === 'pending'
      ? transaction.type === TYPE_SEND
        ? 'Send Attempted'
        : 'Request Sent'
      : transactionType;

    const otherWalletAddress = transaction.details.creates
      ? transaction.details.creates
      : transaction[otherWalletKeyForType[transactionType]];

    const date = new Date(transaction.date);

    const metadata = getCoinMetadata(transaction.symbol);

    const formattedAmount = Number(transaction.amount)
      .toString()
      .match(new RegExp(`^\\d+.?(\\d{0,${metadata.pointsOfPrecision}})?`))[0]
      .slice(0, this.state.trimAmount ? -this.state.trimAmount : undefined);

    return (
      <ListItem
        imageSource={actionIcon[transactionType]}
        leftLarge={toTitleCase(tradeTitle)}
        leftSmall={`${otherWalletKeyForType[transactionType]} ${trimAddress(
          otherWalletAddress
        )}`}
        rightLarge={`${Number(formattedAmount).toString()}${
          this.state.trimAmount ? '+' : ''
        } ${transaction.symbol}`}
        rightSmall={date.toLocaleString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })}
        onLayoutRightLarge={this.handleAmountLayout}
      />
    );
  }
}

// eslint-disable-next-line immutable/no-mutation
TradeItem.propTypes = {
  transaction: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
};

export default TradeItem;
