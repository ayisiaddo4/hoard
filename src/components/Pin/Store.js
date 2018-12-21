import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  KeyboardAvoidingView,
  Text,
  View,
  StyleSheet,
  TextInput,
  Platform,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import InputList from './InputList';
import { saveKey } from './utils';
import Button from 'components/Button';
import T from 'components/Typography';
import NavigatorService from 'lib/navigator';

const LANG_ENTER_STRING = 'Set Pin';
const LANG_CONFIRM_STRING = 'Please confirm your PIN.';
const LANG_SUCCESS_STRING = 'Your PIN was saved successfully!';

export default class Store extends Component {
  static propTypes = {
    handleSuccess: PropTypes.func,
    pinLength: PropTypes.number,
  };

  static defaultProps = {
    handleSuccess: () => false,
    pinLength: 6,
  };

  state = {
    attempts: 0,
    confirmPin: null,
    pin: null,
    pinValue: '',
    valid: false,
  };

  handleInputRef = ref => (this.inputEl = ref);

  shake = () => this.inputEl.shake(800);

  storePin = value => {
    if (this.state.pin) {
      if (value !== this.state.pin) {
        this.shake();
        this.setState({
          pinValue: '',
          confirmPin: value,
          valid: false,
          attempts: this.state.attempts + 1,
        });
      } else {
        saveKey(value);
        this.setState({ confirmPin: value, pinValue: '', valid: true });
      }
    } else {
      this.setState({ pin: value, pinValue: '' });
    }
  };

  onSuccessHandler = () => {
    NavigatorService.resetReplace('Login', 'Wallet');
  };

  handlePinPress = pinValue => {
    if (pinValue.length >= this.props.pinLength) {
      this.storePin(pinValue);
    } else {
      this.setState({ pinValue });
    }
  };

  render() {
    return (
      <Animatable.View animation="fadeInUp" style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="padding"
          enabled={!this.state.valid}
        >
          <View style={styles.pinView}>
            <T.Heading style={styles.text}>
              {this.state.valid
                ? ''
                : !this.state.pin
                ? LANG_ENTER_STRING
                : LANG_CONFIRM_STRING}
              {this.state.pin && this.state.valid && LANG_SUCCESS_STRING}
            </T.Heading>
            <Text style={styles.pinPromptText}>
              {!this.state.pin &&
                'Your PIN will be used to unlock your wallet and send or receive.'}
              {this.state.pin &&
                this.state.confirmPin &&
                !this.state.valid &&
                'PIN was not the same'}
            </Text>
            <Text style={styles.pinPromptText}>
              Attempts: {this.state.attempts}
            </Text>
            {!this.state.valid && (
              <Animatable.View ref={this.handleInputRef}>
                <InputList
                  pinLength={this.props.pinLength}
                  pinValue={this.state.pinValue}
                />
              </Animatable.View>
            )}

            {this.state.pin && this.state.valid && (
              <View style={styles.buttonContainer}>
                <Button onPress={this.onSuccessHandler} style={styles.button}>
                  {'Go to dashboard'}
                </Button>
              </View>
            )}
          </View>
          {!this.state.valid && (
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
              maxLength={this.props.pinLength}
              value={this.state.pinValue}
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
  pinView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    backgroundColor: 'transparent',
  },
  pinKeyboard: {
    flex: -1,
    flexShrink: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pinKey: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '33.33%',
    height: 70,
    borderWidth: 1,
    borderColor: 'transparent',
    color: 'white',
    flexGrow: 1,
    paddingTop: 8,
  },
  pinKeyEmpty: {
    backgroundColor: 'transparent',
  },
  pinPromptText: {
    color: 'white',
    margin: 10,
    marginHorizontal: 50,
    textAlign: 'center',
  },
  text: {
    color: 'white',
  },
  buttonContainer: {
    margin: 20,
    padding: 20,
    width: '100%',
  },
  button: {
    width: '100%',
    padding: 10,
  },
  hiddenInputIOS: {
    display: 'none',
  },
  hiddenInputAndroid: {
    height: 0,
    color: 'transparent',
  },
});
