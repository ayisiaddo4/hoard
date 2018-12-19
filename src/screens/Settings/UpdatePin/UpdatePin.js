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
import InputList from 'components/Pin/InputList';
import { saveKey, validateKey } from 'components/Pin/utils';
import T from 'components/Typography';
import NavigatorService from 'lib/navigator';
import { t } from 'translations/i18n';

export default class UpdatePin extends Component {
  static propTypes = {
    pinLength: PropTypes.number,
    notificationRecieved: PropTypes.func.isRequired,
  };

  static defaultProps = {
    pinLength: 6,
  };

  state = {
    currentInputValue: '',
    pin: '',
    newPin: '',
    confirmPin: '',
  };

  handleInputRef = ref => (this.inputEl = ref);

  shake = () => this.inputEl.shake(800);

  validatePin = async pinValue => {
    const valid = await validateKey(pinValue);
    let pin = pinValue;

    if (!valid) {
      this.shake();
      pin = '';
    }

    this.setState({
      currentInputValue: '',
      pin,
    });
  };

  setNewPin = async newPin => {
    this.setState({
      currentInputValue: '',
      newPin,
    });
  };

  confirmPin = async confirmPinValue => {
    let confirmPin = confirmPinValue;
    let newPin = this.state.newPin;
    let success = false;

    if (confirmPinValue === newPin) {
      success = true;
      await saveKey(confirmPin);
    } else {
      this.shake();
      newPin = '';
      confirmPin = '';
    }

    this.setState({
      currentInputValue: '',
      newPin,
      confirmPin,
    });
    return success;
  };

  storePin = async value => {
    if (!this.state.pin) {
      this.validatePin(value);
    } else if (!this.state.newPin) {
      this.setNewPin(value);
    } else if (!this.state.confirmPin) {
      const success = await this.confirmPin(value);
      if (success) {
        this.props.notificationRecieved({
          type: 'success',
          title: t('update_pin.success_title'),
          content: t('update_pin.success_subtitle'),
        });
        NavigatorService.navigate('Settings');
      }
    }
  };

  handlePinPress = currentInputValue => {
    if (currentInputValue.length >= this.props.pinLength) {
      this.storePin(currentInputValue);
    } else {
      this.setState({ currentInputValue });
    }
  };

  render() {
    let title = '';
    let subtitle = '';

    if (!this.state.pin) {
      title = t('update_pin.current_pin_title');
      subtitle = t('update_pin.current_pin_subtitle');
    } else if (!this.state.newPin) {
      title = t('update_pin.new_pin_title');
      subtitle = t('update_pin.new_pin_subtitle');
    } else if (!this.state.confirmPin) {
      title = t('update_pin.confirm_pin_title');
      subtitle = t('update_pin.confirm_pin_subtitle');
    }

    return (
      <Animatable.View animation="fadeInUp" style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="padding"
          enabled={!this.state.valid}
        >
          <View style={styles.pinView}>
            <T.Heading style={styles.text}>{title}</T.Heading>
            <Text style={styles.pinPromptText}>{subtitle}</Text>
            {!this.state.confirmPin && (
              <Animatable.View ref={this.handleInputRef}>
                <InputList
                  pinLength={this.props.pinLength}
                  pinValue={this.state.currentInputValue}
                />
              </Animatable.View>
            )}
          </View>
          {!this.state.confirmPin && (
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
              value={this.state.currentInputValue}
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
  pinPromptText: {
    color: 'white',
    margin: 10,
    marginHorizontal: 50,
    textAlign: 'center',
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
