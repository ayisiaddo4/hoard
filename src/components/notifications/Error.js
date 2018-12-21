import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';

const Error = props => (
  <View style={styles.container}>
    <Text style={styles.title}>{props.title}</Text>
    <Text style={styles.message}>{props.message}</Text>
  </View>
);

Error.propTypes = {
  title: PropTypes.string,
  message: PropTypes.message,
};

export default Error;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F03434',
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  message: {
    fontSize: 14,
    fontWeight: '300',
  },
});
