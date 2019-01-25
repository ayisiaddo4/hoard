import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Image, View } from 'react-native';

import { Layout } from 'components/Base';
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
import ErrorReport from './ErrorReport';

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
    transaction: PropTypes.shape({
      status: PropTypes.oneOf([
        TRANSACTION_PENDING,
        TRANSACTION_SUCCESS,
        TRANSACTION_ERROR,
      ]).isRequired,
      error: PropTypes.any,
    }).isRequired,
  };

  toDashboard() {
    NavigatorService.navigate('Wallet');
  }

  render() {
    const { transaction, navigation } = this.props;
    const isContactTransaction = navigation.state.params.isContactTransaction;
    const type = navigation.state.params.type;
    let heading, subheading; // eslint-disable-line immutable/no-let

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
      if (transaction.status === TRANSACTION_SUCCESS) {
        heading = t(
          'transaction_status.blockchain_transaction.success_heading'
        );
        subheading = t(
          'transaction_status.blockchain_transaction.success_subheading'
        );
      } else if (transaction.status === TRANSACTION_ERROR) {
        heading = t(
          'transaction_status.blockchain_transaction.failure_heading'
        );
        subheading = t(
          'transaction_status.blockchain_transaction.failure_subheading'
        );
      }
    }

    const size = transaction.status === TRANSACTION_ERROR ? 120 : 240;

    return (
      <Layout>
        <View style={styles.container}>
          <View style={[styles.half, styles.imageContainer]}>
            <Image
              style={[styles.image, { height: size, width: size }]}
              source={
                transaction.status === TRANSACTION_ERROR
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
            {transaction.status === TRANSACTION_ERROR && transaction.error && (
              <View style={styles.errorContainer}>
                <T.Light style={styles.additionalInfo}>
                  {t('transaction_status.additional_error_information')}
                </T.Light>
                <View style={styles.errorBorder}>
                  <ErrorReport
                    name={transaction.error.name}
                    value={
                      transaction.error.message
                        ? transaction.error.message
                        : transaction.error
                    }
                  />
                </View>
              </View>
            )}
            <Try
              condition={
                transaction.status !== TRANSACTION_PENDING ||
                isContactTransaction
              }
            >
              <Button style={styles.actionButton} onPress={this.toDashboard}>
                Go To Dashboard
              </Button>
            </Try>
          </View>
        </View>
      </Layout>
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
  errorContainer: {
    marginTop: 20,
  },
  additionalInfo: {
    color: 'white',
    textAlign: 'center',
  },
  errorBorder: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
});
