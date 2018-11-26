import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, StyleSheet, View, ViewPropTypes } from 'react-native';

const LoadingSpinner = (props) => {
  return (
    <View style={[ styles.loader, props.style ]}>
      <ActivityIndicator size={props.size || "large"} />
    </View>
  );
};

LoadingSpinner.propTypes = {
  style: ViewPropTypes.style,
  size: PropTypes.string,
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingSpinner;
