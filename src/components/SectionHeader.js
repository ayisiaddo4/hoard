import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import T from 'components/Typography';

const SectionHeader = ({ children }) => (
  <View style={styles.container}>
    <T.SubHeading style={styles.heading}>{children}</T.SubHeading>
  </View>
);

SectionHeader.propTypes = {
  children: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairline,
    borderColor: 'lightgrey',
    borderStyle: 'solid',
  },
  heading: {
    fontFamily: "HelveticaNeue",
    fontSize: 22,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 28,
    letterSpacing: 0,
    color: "#ffffff"
  },
});

export default SectionHeader;
