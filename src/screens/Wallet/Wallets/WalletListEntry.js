import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import T from 'components/Typography';
import Icon from 'components/Icon';
import Conditional, { Try, Otherwise } from 'components/Conditional';
import { getCoinMetadata } from 'lib/currency-metadata';

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
  const value =
    [balanceStatus, priceStatus].reduce(
      (prev, status) => prev && status === ENTRY_STATUS.SUCCESSFUL,
      true
    ) && (Number(price) * Number(balance)).toFixed(2);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.left}>
          <View style={styles.iconContainer}>
            <Conditional>
              <Try condition={imported}>
                <View style={styles.icon}>
                  <Icon style={{ size: 15, color: 'black' }} icon="ios-link" />
                </View>
              </Try>
              <Otherwise>
                <Image
                  style={styles.coinImage}
                  source={getCoinMetadata(symbol).image}
                />
              </Otherwise>
            </Conditional>
          </View>

          <View style={styles.titleContainer}>
            <T.TitleAlternate style={{ color: 'lightgrey', fontSize: 20 }}>
              {name}
            </T.TitleAlternate>
            <T.SmallAlternate style={{ color: '#777' }}>
              <Conditional>
                <Try condition={priceStatus === ENTRY_STATUS.SUCCESSFUL}>
                  ${price} / {symbol}
                </Try>
                <Otherwise>...</Otherwise>
              </Conditional>
            </T.SmallAlternate>
          </View>
        </View>

        <View style={styles.right}>
          <T.Price style={{ color: 'lightgrey', fontSize: 20 }}>
            <Conditional>
              <Try
                condition={
                  priceStatus === ENTRY_STATUS.SUCCESSFUL &&
                  balanceStatus === ENTRY_STATUS.SUCCESSFUL
                }
              >
                ${value}
              </Try>
              <Otherwise>...</Otherwise>
            </Conditional>
          </T.Price>
          <T.SubtitleAlternate>
            <T.SemiBoldAlternate style={{ color: '#777' }}>
              <Conditional>
                <Try condition={balanceStatus === ENTRY_STATUS.SUCCESSFUL}>
                  {balance} {symbol}
                </Try>
                <Otherwise>...</Otherwise>
              </Conditional>
            </T.SemiBoldAlternate>
          </T.SubtitleAlternate>
        </View>
      </View>
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

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    marginHorizontal: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#202934',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'column',
  },
  icon: {
    paddingLeft: 5,
  },
  left: {
    flexDirection: 'row',
    flexGrow: 2,
  },
  right: {
    flexGrow: 1,
    alignItems: 'flex-end',
  },
  coinImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});
