import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function AlignmentHelper() {
  return (
    <View style={styles.absoluteContainer}>
      <View style={styles.horizontalContainer}>
        <View style={styles.horizontalLine} />
        <View style={styles.horizontalLine} />
        <View style={styles.horizontalLine} />
      </View>
      <View style={styles.absoluteContainer}>
        <View style={styles.verticalContainer}>
          <View style={styles.verticalLine} />
          <View style={styles.verticalLine} />
          <View style={styles.verticalLine} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteContainer: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'blue',
    borderStyle: 'solid',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  horizontalContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    textAlign: 'center',
    flex: 1,
  },
  horizontalLine: {
    backgroundColor: 'red',
    width: '100%',
    height: StyleSheet.hairlineWidth,
  },
  verticalContainer: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    textAlign: 'center',
    flex: 1,
  },
  verticalLine: {
    backgroundColor: 'red',
    height: '100%',
    width: StyleSheet.hairlineWidth,
  },
});
