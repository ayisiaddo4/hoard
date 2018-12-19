import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Config from 'react-native-config';
import { View, Text, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import Button from 'components/Button';

const TRANSACTION_URL = `${Config.EREBOR_ENDPOINT}/transactions/confirm`;

export function makeQueryString(queries) {
  if (queries && queries.length) {
    return `?${queries.map(q => `${q.name}=${q.value}`).join('&')}`;
  }

  return '';
}

export async function makeTransactionRequest(url, queries) {
  return api.get(`${url}${makeQueryString(queries)}`);
}

export default class ConfirmTransaction extends Component {

  handleRequest = async (confirm) => {
    return `{success: ${confirm}}`;
    try {
      const json = await makeTransactionRequest(TRANSACTION_URL, `confirm=${confirm}`);
      if (json.success) {
        // TODO: handle success
      }
    } catch (error) {
      if (__DEV__) {
        console.log('error! ', error); // eslint-disable-line no-console
      }
    }
  };

  confirmTransaction = () => {
    this.handleRequest(true).then((response)=> alert('Handle Approve', response));

  }

  denyTransaction = () => {
    this.handleRequest(false).then((response)=> alert('Handle Reject',  response ) );
  }

  render() {

    return (
      <View
        style={styles.container}
      >
        <Text style={styles.header}>Continue transaction?</Text>
        <Text style={styles.header}>Send to: {this.props.navigation.state.params.uid || 'Unknown User'}</Text>
        <Text style={styles.header}>Transaction ID: {this.props.navigation.state.params.tx || 'Unknown Transaction'}</Text>
        <Text style={styles.text}>Your contact is now online. Would you like to continue and broadcast this transaction?</Text>
        <Button
          onPress={this.confirmTransaction}
          type="primary"
        >
          Yes, continue this transaction.
        </Button>
        <Button
          onPress={this.denyTransaction}
          type="secondary"
        >
          No, cancel this transaction.
        </Button>

      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {},
  header: {
    fontSize: 25,
    fontWeight: '900',
    color: '#000',
  },
});
