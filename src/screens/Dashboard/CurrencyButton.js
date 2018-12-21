import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableHighlight } from 'react-native';
import { getColors } from 'styles';

const CurrencyButton = ({ children, selected, onPress }) => {
  const themedStyles = getThemedStyles(getColors());

  const containerStyles = [styles.container];
  const textStyles = [styles.text, themedStyles.text];
  if (selected) {
    containerStyles.push(themedStyles.containerSelected);
    textStyles.push(themedStyles.textSelected);
  }
  return (
    <TouchableHighlight style={containerStyles} onPress={onPress}>
      <Text style={textStyles}>{children}</Text>
    </TouchableHighlight>
  );
};

CurrencyButton.propTypes = {
  children: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired, // takes event object
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginRight: 5,
    marginLeft: 5,
    padding: 5,
    borderRadius: 5,
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const getThemedStyles = colors => {
  return {
    containerSelected: {
      backgroundColor: colors.interactivePrimary,
    },
    text: {
      color: colors.textSecondary,
    },
    textSelected: {
      color: colors.textPrimary,
    },
  };
};

export default CurrencyButton;
