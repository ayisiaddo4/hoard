/*
 Animate Wrapper - animates an array of children using explicitly defined
 animations.

 ANIMATIONS:
 Each animation should has an object structure roughly as follows:
 {
    type: STRING, // the constant that was imported
    parameters: {
      start: NUMBER, // what the animation should start at
      end: NUMBER, // what the animation should finish at
    }
 }
USAGE:
// First, import the Animation component and any animations you wish to use.
import Animations, { FADE, SLIDE_X, SLIDE_Y } from '../path/to/Animations'

// Next, wrap any children that should animate in the <Animation> component.
// Each child will then be animated according to the animations prop of the
// parent wrapper.
// TODO: children should be able to have their own, independent <Animated.View>

<Animations
  animations={[
    {type: FADE, parameters: {start: 0, end: 100}}
    {type: SLIDE_X, parameters: {start: 20, end: 0}}
    {type: SLIDE_Y, parameters: {start: 20, end: 0}}
  ]}
  enterDelay={40}
  enterDuration={40}
  enterStagger={40}
  onEnterComplete= fn()
  exitDelay={20}
  exitDuration={20}
  exitStagger={20}

>
  <View />
  <View />
  <View />
  <View />
  <View />
</Animations>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Animated } from 'react-native';

export const FADE = 'FADE';
export const SLIDE_X = 'SLIDE_X';
export const SLIDE_Y = 'SLIDE_Y';

export function fadeStyle(animatedValue, parameters) {
  if (!animatedValue) {
    return {};
  }

  return {
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [parameters.start || 0, parameters.end || 1],
      extrapolate: 'clamp',
      useNativeDriver: true,
    }),
  };
}

export function slideXStyle(animatedValue, parameters) {
  if (!animatedValue) {
    return {};
  }
  return {
    transform: [
      {
        translateX: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [parameters.start || 0, parameters.end || 1],
          extrapolate: 'clamp',
          useNativeDriver: true,
        }),
      },
    ],
  };
}
export function slideYStyle(animatedValue, parameters) {
  if (!animatedValue) {
    return {};
  }
  return {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [parameters.start || 0, parameters.end || 1],
          extrapolate: 'clamp',
          useNativeDriver: true,
        }),
      },
    ],
  };
}

class Animations extends Component {
  static propTypes = {
    children: PropTypes.array.isRequired,
    animations: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        parameters: PropTypes.shape({
          start: PropTypes.number.isRequired,
          end: PropTypes.number.isRequired,
        }).isRequired,
      }).isRequired
    ).isRequired,
    startAnimation: PropTypes.bool.isRequired,
    exitAnimation: PropTypes.bool.isRequired,
    enterDelay: PropTypes.number,
    enterDuration: PropTypes.number,
    enterStagger: PropTypes.number,
    onEnterComplete: PropTypes.func,
    exitDelay: PropTypes.number,
    exitDuration: PropTypes.number,
    exitStagger: PropTypes.number,
    onExitComplete: PropTypes.func,
    style: PropTypes.object,
    itemStyle: PropTypes.object,
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.animatedValues = [];
    this.props.children.forEach((child, i) => {
      this.animatedValues[i] = new Animated.Value(0);
    });
  }

  componentWillReceiveProps(newProps) {
    if (newProps && newProps.startAnimation === true) {
      this.animate(
        {
          fromValue: 0,
          toValue: 1,
          delay: this.props.enterDelay,
          duration: this.props.enterDuration,
          stagger: this.props.enterStagger,
        },
        this.props.onEnterComplete
      );
    } else if (newProps && newProps.exitAnimation === true) {
      this.animate(
        {
          fromValue: 1,
          toValue: 0,
          delay: this.props.exitDelay,
          duration: this.props.exitDuration,
          stagger: this.props.exitStagger,
        },
        this.props.onExitComplete
      );
    }
  }

  animate = (
    { fromValue, toValue, delay, duration, stagger },
    completeCallback
  ) => {
    const animations = this.animatedValues.map((item, i) => {
      this.animatedValues[i].setValue(fromValue);

      return Animated.timing(this.animatedValues[i], {
        toValue,
        delay: delay * i,
        duration,
      });
    });
    Animated.stagger(stagger, animations).start(completeCallback);
  };

  render() {
    const animations = this.props.children.map((child, i) => {
      const animatedStyles = this.props.animations.map(
        ({ type, parameters }) => {
          switch (type) {
            case FADE:
              return fadeStyle(this.animatedValues[i], parameters);
            case SLIDE_X:
              return slideXStyle(this.animatedValues[i], parameters);
            case SLIDE_Y:
              return slideYStyle(this.animatedValues[i], parameters);
          }
        }
      );

      return (
        <Animated.View key={i} style={animatedStyles}>
          {child}
        </Animated.View>
      );
    });
    return (
      <View style={[styles.container, this.props.style]}>{animations}</View>
    );
  }
}

export default Animations;

const styles = StyleSheet.create({
  container: {},
});
