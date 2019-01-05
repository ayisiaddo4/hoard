import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  KeyboardAvoidingView,
  Text,
  View,
  Image,
  StyleSheet,
  TextInput,
  Platform,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import T from 'components/Typography';
import InputList from 'components/Pin/InputList';

export default class PinScreen extends Component {
  static propTypes = {
    children: PropTypes.node,
    expectedPin: PropTypes.string,
    maxAttempts: PropTypes.number,
    pinLength: PropTypes.number.isRequired,
    showKeyboard: PropTypes.bool,
    subtitle: PropTypes.string,
    title: PropTypes.string,
    onFailure: PropTypes.func,
    onSuccess: PropTypes.func.isRequired,
  };

  static defaultProps = {
    maxAttempts: Infinity,
    pinLength: 6,
  };

  state = {
    currentInputValue: '',
    attempts: 0,
  };

  handleInputRef = ref => (this.inputEl = ref); // eslint-disable-line immutable/no-mutation

  shake = () => this.inputEl.shake(800);

  validatePin = pinValue => {
    if (this.props.expectedPin) {
      return pinValue === this.props.expectedPin;
    }

    return true;
  };

  handlePinCompletion = async value => {
    if (this.validatePin(value)) {
      this.setState(
        {
          attempts: 0,
          currentInputValue: '',
        },
        () => this.props.onSuccess(value)
      );
    } else {
      if (this.state.attempts < this.props.maxAttempts) {
        this.shake();
        this.setState({
          attempts: this.state.attempts + 1,
          currentInputValue: '',
        });
      } else {
        this.setState(
          {
            attempts: 0,
            currentInputValue: '',
          },
          () => this.props.onFailure && this.props.onFailure()
        );
      }
    }
  };

  handlePinPress = currentInputValue => {
    if (currentInputValue.length >= this.props.pinLength) {
      this.handlePinCompletion(currentInputValue);
    } else {
      this.setState({ currentInputValue });
    }
  };

  render() {
    const { showKeyboard, title, subtitle, pinLength, children } = this.props;

    const { attempts, currentInputValue } = this.state;
    return (
      <Animatable.View animation="fadeInUp" style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior="padding"
          enabled={showKeyboard}
        >
          <View style={styles.shieldContainer}>
            <Image
              style={styles.shield}
              resizeMode="contain"
              source={require('assets/pin-shield.png')}
            />
          </View>
          <View style={styles.pinView}>
            {!!title && <T.Heading style={styles.text}>{title}</T.Heading>}
            {!!subtitle && <Text style={styles.pinPromptText}>{subtitle}</Text>}

            {attempts > 0 && (
              <Text style={styles.pinPromptText}>Attempts: {attempts}</Text>
            )}

            {showKeyboard && (
              <Animatable.View style={styles.pips} ref={this.handleInputRef}>
                <InputList pinLength={pinLength} pinValue={currentInputValue} />
              </Animatable.View>
            )}

            {children}
          </View>
          {showKeyboard && (
            <TextInput
              style={
                Platform.OS === 'ios'
                  ? styles.hiddenInputIOS
                  : styles.hiddenInputAndroid
              }
              caretHidden={true}
              selectTextOnFocus={true}
              autoCorrect={false}
              autoFocus={true}
              keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'phone-pad'}
              maxLength={pinLength}
              value={currentInputValue}
              onChangeText={this.handlePinPress}
            />
          )}
        </KeyboardAvoidingView>
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  keyboardView: {
    flex: 1,
  },
  shieldContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  shield: {
    height: 100,
    width: 100,
  },
  pinView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  pinPromptText: {
    color: 'white',
    margin: 10,
    marginHorizontal: 50,
    textAlign: 'center',
  },
  pips: {
    marginBottom: 50,
  },
  text: {
    color: 'white',
  },
  hiddenInputIOS: {
    display: 'none',
  },
  hiddenInputAndroid: {
    height: 0,
    color: 'transparent',
  },
});
