import { PropTypes } from 'prop-types';
import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  Keyboard,
  StyleSheet,
  TextInput,
  UIManager,
  View,
} from 'react-native';

const { State: TextInputState } = TextInput;

const KEYBOARD_OFFSET = 100;
const VIEW_ANIMATION_SPEED = 300;

export default class KeyboardShift extends Component {
  keyboardshift = new Animated.Value(0);

  state = {
    shift: new Animated.Value(0),
    focusedInput: null,
    keyboardHeight: KEYBOARD_OFFSET,
  };

  componentDidMount() {
    this.keyboardDidShowSub = Keyboard.addListener(
      'keyboardDidShow',
      this.handleKeyboardDidShow
    );
    this.keyboardDidHideSub = Keyboard.addListener(
      'keyboardDidHide',
      this.handleKeyboardDidHide
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
  }

  render() {
    const { children } = this.props;
    return (
      <View style={styles.relativeContainer}>
        <Animated.View
          style={[
            styles.container,
            { transform: [{ translateY: this.keyboardshift }] },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    );
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.focusedInput !== prevState.focusedInput) {
      return { focusedInput: nextProps.focusedInput };
    } else return null;
  }

  componentDidUpdate(prevProps, prevState) {
    const currentlyFocusedField = TextInputState.currentlyFocusedField();
    if (prevState.focusedInput !== this.props.focusedInput) {
      this.switchFocus(currentlyFocusedField);
    }
  }

  switchFocus(currentlyFocusedField) {
    this.setState({ focusedInput: currentlyFocusedField }, () =>
      this.handleSwitchFocus(currentlyFocusedField)
    );
  }

  handleSwitchFocus() {
    const currentlyFocusedField = TextInput.State.currentlyFocusedField();
    if (!currentlyFocusedField) {
      return;
    }
    const { height: windowHeight } = Dimensions.get('window');
    const { keyboardHeight } = this.state;
    UIManager.measure(
      currentlyFocusedField,
      (originX, originY, width, height, pageX, pageY) => {
        const fieldHeight = height / 2;
        const fieldTop = pageY;
        const gap = windowHeight - keyboardHeight - (fieldTop + fieldHeight);
        if (gap >= 0) {
          return;
        }

        Animated.timing(this.keyboardshift, {
          toValue: gap,
          duration: VIEW_ANIMATION_SPEED,
          useNativeDriver: true,
        }).start();
      }
    );
  }

  handleKeyboardDidShow = event => {
    const currentlyFocusedField = TextInputState.currentlyFocusedField();
    const keyboardHeight = event.endCoordinates.height + KEYBOARD_OFFSET;
    this.setState({ keyboardHeight: keyboardHeight }, () =>
      this.switchFocus(currentlyFocusedField)
    );
  };

  handleKeyboardDidHide = () => {
    Animated.timing(this.keyboardshift, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };
}

const styles = StyleSheet.create({
  relativeContainer: {
    flex: 1,
    position: 'relative',
  },
  container: {
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
});

KeyboardShift.propTypes = {
  children: PropTypes.node.isRequired,
  focusedInput: PropTypes.number,
};
