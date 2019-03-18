import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { getCoinMetadata } from 'lib/currency-metadata';
import ListItem from 'components/ListItem';

export const ENTRY_STATUS = {
  ERROR: 'ERROR',
  LOADING: 'LOADING',
  SUCCESSFUL: 'SUCCESSFUL',
};

const WalletListEntry = ({
  name,
  symbol,
  balance,
  balanceStatus,
  onPress,
  imported,
  price,
  priceStatus,
}) => {
  const metadata = getCoinMetadata(symbol);

  const value =
    [balanceStatus, priceStatus].reduce(
      (prev, status) => prev && status === ENTRY_STATUS.SUCCESSFUL,
      true
    ) && (Number(price) * Number(balance)).toFixed(2);

  const formattedPrice = Number(price)
    .toFixed(5)
    .replace(/0{0,3}$/, '');

  const formattedBalance =
    balance &&
    balance
      .toString()
      .match(new RegExp(`^\\d+.?(\\d{0,${metadata.pointsOfPrecision}})?`))[0];

  return (
    <TouchableOpacity onPress={onPress}>
      <ListItem
        icon={imported && 'ios-link'}
        imageSource={!imported && metadata.image}
        leftLarge={name}
        leftSmall={
          priceStatus === ENTRY_STATUS.SUCCESSFUL
            ? `$${formattedPrice} / ${symbol}`
            : '...'
        }
        rightLarge={
          priceStatus === ENTRY_STATUS.SUCCESSFUL &&
          balanceStatus === ENTRY_STATUS.SUCCESSFUL
            ? `$${value}`
            : '...'
        }
        rightSmall={
          balanceStatus === ENTRY_STATUS.SUCCESSFUL
            ? `${formattedBalance} ${symbol}`
            : '...'
        }
      />
    </TouchableOpacity>
  );
};

export default WalletListEntry;

const EntryStatusProp = PropTypes.oneOf([
  ENTRY_STATUS.SUCCESSFUL,
  ENTRY_STATUS.LOADING,
  ENTRY_STATUS.ERROR,
]);

WalletListEntry.propTypes = {
  balance: PropTypes.number,
  price: PropTypes.number,
  balanceStatus: EntryStatusProp.isRequired,
  priceStatus: EntryStatusProp.isRequired,
  change: PropTypes.string.isRequired,
  imported: PropTypes.bool,
  name: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};
