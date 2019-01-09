import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { saveKey } from './utils';
import Button from 'components/Button';
import NavigatorService from 'lib/navigator';
import PinScreen from 'components/Pin/PinScreen';

const LANG_ENTER_STRING = 'Set Pin';
const LANG_CONFIRM_STRING = 'Please confirm your PIN.';
const LANG_SUCCESS_STRING = 'Your PIN was saved successfully!';

export default class Store extends Component {
  static propTypes = {
    pinLength: PropTypes.number,
  };

  static defaultProps = {
    pinLength: 6,
  };

  state = {
    loading: false,
    pin: null,
    confirmPin: null,
  };

  handleSetPin = pin => this.setState({ pin });

  handleConfirmPin = confirmPin => {
    this.setState({ confirmPin });
    saveKey(confirmPin);
  };

  onSuccessHandler = () => {
    this.setState({ loading: true }, () =>
      requestAnimationFrame(() =>
        NavigatorService.resetReplace('Login', 'Wallet')
      )
    );
  };

  render() {
    const { pinLength } = this.props;
    const { pin, confirmPin } = this.state;
    let title = ''; // eslint-disable-line immutable/no-let
    if (!pin) {
      title = LANG_ENTER_STRING;
    } else if (!confirmPin) {
      title = LANG_CONFIRM_STRING;
    } else {
      title = LANG_SUCCESS_STRING;
    }

    return (
      <SafeAreaView forceInset={{ top: 'always' }} style={styles.safeArea}>
        <PinScreen
          title={title}
          subtitle={
            pin
              ? ''
              : 'Your PIN will be used to unlock your wallet and send or receive.'
          }
          pinLength={pinLength}
          expectedPin={pin}
          showKeyboard={!confirmPin}
          onSuccess={pin ? this.handleConfirmPin : this.handleSetPin}
        >
          {!!confirmPin && (
            <View style={styles.buttonContainer}>
              <Button
                onPress={this.onSuccessHandler}
                style={styles.button}
                loading={this.state.loading}
              >
                {'Go to dashboard'}
              </Button>
            </View>
          )}
        </PinScreen>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
});
