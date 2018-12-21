import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Image, View } from 'react-native';

import Scene from 'components/Scene';
import T from 'components/Typography';
import {
  TRANSACTION_PENDING,
  TRANSACTION_SUCCESS,
  TRANSACTION_ERROR,
} from './constants';
import { TYPE_SEND, TYPE_REQUEST } from 'screens/SendRequest/constants';
import NavigatorService from 'lib/navigator';
import { t } from 'translations/i18n';
import { Try } from 'components/Conditional';
import Button from 'components/Button';

export default class TransactionStatus extends Component {
  static propTypes = {
    navigation: {
      state: {
        params: {
          id: PropTypes.string.isRequired,
          isContactTransaction: PropTypes.bool,
          type: PropTypes.oneOf([TYPE_SEND, TYPE_REQUEST]),
        },
      },
    },
    transaction: PropTypes.oneOf([
      TRANSACTION_PENDING,
      TRANSACTION_SUCCESS,
      TRANSACTION_ERROR,
    ]).isRequired,
  };

  toDashboard() {
    NavigatorService.navigate('Wallet');
  }

  render() {
    const { transaction, navigation } = this.props;
    const isContactTransaction = navigation.state.params.isContactTransaction;
    const type = navigation.state.params.type;
    let heading, subheading;

    if (isContactTransaction) {
      heading = t('transaction_status.contact_transaction.heading');
      if (type === TYPE_REQUEST) {
        subheading = t(
          'transaction_status.contact_transaction.request_subheading'
        );
      }
      if (type === TYPE_SEND) {
        subheading = t(
          'transaction_status.contact_transaction.send_subheading'
        );
      }
    } else {
      heading = t('transaction_status.blockchain_transaction.pending_heading');
      if (transaction === TRANSACTION_SUCCESS) {
        heading = t(
          'transaction_status.blockchain_transaction.success_heading'
        );
        subheading = t(
          'transaction_status.blockchain_transaction.success_subheading'
        );
      } else if (transaction === TRANSACTION_ERROR) {
        heading = t(
          'transaction_status.blockchain_transaction.failure_heading'
        );
        subheading = t(
          'transaction_status.blockchain_transaction.failure_subheading'
        );
      }
    }

    const size = transaction === TRANSACTION_ERROR ? 120 : 240;

    return (
      <Scene preload={false}>
        <View style={styles.container}>
          <View style={[styles.half, styles.imageContainer]}>
            <Image
              style={[styles.image, { height: size, width: size }]}
              source={
                transaction === TRANSACTION_ERROR
                  ? require('assets/error-circle.png')
                  : require('assets/waiting_icon.png')
              }
            />
          </View>
          <View style={styles.half}>
            <T.Heading style={styles.heading}>{heading}</T.Heading>
            <Try condition={!!subheading}>
              <T.SubHeading style={styles.subheading}>
                {subheading}
              </T.SubHeading>
            </Try>
            <Try
              condition={
                transaction !== TRANSACTION_PENDING || isContactTransaction
              }
            >
              <Button style={styles.actionButton} onPress={this.toDashboard}>
                Go To Dashboard
              </Button>
            </Try>
          </View>
        </View>
      </Scene>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    margin: 40,
    resizeMode: 'contain',
  },
  half: {
    flex: 1,
  },
  heading: {
    color: 'white',
    textAlign: 'center',
  },
  subheading: {
    color: 'white',
    textAlign: 'center',
  },
  actionButton: {
    marginTop: 'auto',
    marginBottom: 30,
  },
});
