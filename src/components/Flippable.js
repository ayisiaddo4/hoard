/*
  Usage:

  export const ENTRIES = [
    {
      title: 'My Balance',
      amount: '$86,753.09',
      change: '+5.65',
      colors: ['#129161', '#0C6169'],
    },
    {
      title: 'My Balance',
      amount: '$86,753.09',
      change: '+5.65',
      colors: ['#A55324', '#AE2282'],
    },
    {
      title: 'My Balance',
      amount: '$86,753.09',
      change: '+5.65',
      colors: ['#0C6169', '#129161'],
    },
  ];

  {ENTRIES.map(item => (
    <Flippable
      title={item.title}
      amount={item.amount}
      change={item.change}
      colors={item.colors}
    />
  ))}

 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableOpacity, Animated } from 'react-native';

export default class Flippable extends Component {
  static propTypes = {
    front: PropTypes.node.isRequired,
    back: PropTypes.node.isRequired,
  };

  componentWillMount() {
    this.animatedValue = new Animated.Value(0);
    this.value = 0;
    this.animatedValue.addListener(({ value }) => {
      this.value = value;
    });

    this.frontInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg'],
    });
    this.backInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['180deg', '360deg'],
    });
    this.depthInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 60, 180],
      outputRange: [1, 1.25, 1],
    });
    this.frontOpacity = this.animatedValue.interpolate({
      inputRange: [89, 90],
      outputRange: [1, 0],
    });
    this.backOpacity = this.animatedValue.interpolate({
      inputRange: [89, 90],
      outputRange: [0, 1],
    });
  }

  flipCard() {
    if (this.value >= 90) {
      Animated.spring(this.animatedValue, {
        toValue: 0,
        friction: 4,
        tension: 5,
      }).start();
    } else {
      Animated.spring(this.animatedValue, {
        toValue: 180,
        friction: 4,
        tension: 5,
      }).start();
    }
  }

  render() {
    const frontAnimatedStyle = {
      transform: [
        { rotateY: this.frontInterpolate },
        { scaleY: this.depthInterpolate },
      ],
    };
    const backAnimatedStyle = {
      transform: [
        { rotateY: this.backInterpolate },
        { scaleY: this.depthInterpolate },
      ],
    };

    return (
      <TouchableOpacity style={styles.container} onPress={this.flipCard}>
        <View>
          <Animated.View
            style={[
              styles.flipCard,
              frontAnimatedStyle,
              { opacity: this.frontOpacity },
            ]}
          >
            {this.props.front}
          </Animated.View>

          <Animated.View
            style={[
              backAnimatedStyle,
              styles.flipCard,
              styles.flipCardBack,
              { opacity: this.backOpacity },
            ]}
          >
            {this.props.back}
          </Animated.View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  flipCard: {
    backfaceVisibility: 'hidden',
  },
  flipCardBack: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
  },
});
