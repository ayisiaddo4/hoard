import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, Image, View } from 'react-native';
import { getNetworkForCoin } from 'lib/currency-metadata';
import T from 'components/Typography';
import { t } from 'translations/i18n';
import { Try } from 'components/Conditional';
import { dimensions, breakpoints } from 'styles';

import { Layout, Body, Header, Footer } from 'components/Base';
import memoize from 'lodash/memoize';

import Button from 'components/Button';
import Input from 'components/Input';
import NavigatorService from 'lib/navigator';

export default class Login extends Component {
  static propTypes = {
    hasMnemonic: PropTypes.bool.isRequired,
    navigation: PropTypes.any,
    loginRequest: PropTypes.func.isRequired,
    login: PropTypes.shape({
      error: PropTypes.string,
    }),
  };

  state = {
    loading: false,
    loggedIn: false,
    error: false,
    errorMessage: '',
    username_or_email: null,
    password: null,
  };

  // Setup References for focusable inputs
  loginPasswordInput = React.createRef();

  static getDerivedStateFromProps(props, state) {
    if (
      state.loading &&
      props.login.error &&
      !props.login.requesting &&
      !props.login.successful
    ) {
      return {
        loading: false,
        error: true,
        errorMessage: props.login.error,
      };
    }
    return null;
  }

  handleSignupButton = () => {
    NavigatorService.navigate('Signup');
  };

  handleCantLogIn = () => {
    NavigatorService.navigate('Forgot');
  };

  handleBypassButton = () => {
    if (this.props.hasMnemonic) {
      NavigatorService.resetReplace('Login', 'Menu');
    } else {
      NavigatorService.navigate('Mnemonic');
    }
  };

  handleFormSubmit = () => {
    this.setState({ errorMessage: '' }, () => {
      if (
        this.state.username_or_email &&
        this.state.username_or_email.length > 1 &&
        this.state.password &&
        this.state.password.length > 1
      ) {
        this.setState({ loading: true }, () =>
          this.props.loginRequest({
            username_or_email: this.state.username_or_email,
            password: this.state.password,
          })
        );
      }
    });
  };

  updateFormField = fieldName => text => {
    this.setState({ [fieldName]: text });
  };

  safeFocus = memoize(element => () => {
    this[element].current.focus();
  });

  render() {
    return (
      <Layout preload={false} keyboard>
        <Body scrollable style={styles.body} navigationOffset={80}>
          <Header style={{ alignItems: 'center', marginTop: -40 }}>
            <Image
              style={styles.logo}
              source={require('assets/hoard_outline_logo.png')}
            />
            <Text style={styles.title}>{t('login.log_in')}</Text>
            <Try condition={__DEV__}>
              <View>
                <T.Small style={styles.network}>{`Using: ${getNetworkForCoin(
                  'ETH'
                ).toUpperCase()}`}</T.Small>
              </View>
            </Try>
          </Header>
          <Body
            style={{
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <Try condition={!!this.state.errorMessage}>
              <View style={styles.errorMessageContainer}>
                <T.Light style={styles.errorMessage}>
                  {this.state.errorMessage}
                </T.Light>
              </View>
            </Try>
            <Input
              testID="UsernameInput"
              placeholder={t('input_username')}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              keyboardType="email-address"
              editable={!this.state.loading}
              onSubmitEditing={this.safeFocus('loginPasswordInput')}
              onChangeText={this.updateFormField('username_or_email')}
              value={this.state.username_or_email || ''}
              type="underline"
              blurOnSubmit={false}
            />
            <Input
              testID="PasswordInput"
              inputRef={this.loginPasswordInput}
              placeholder={t('input_password')}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="go"
              keyboardType="default"
              editable={!this.state.loading}
              secureTextEntry
              onSubmitEditing={this.handleFormSubmit}
              onChangeText={this.updateFormField('password')}
              value={this.state.password || ''}
              type="underline"
            />

            <Button
              type="text"
              onPress={this.handleCantLogIn}
              style={styles.buttonContainerAlt}
            >
              {t('login.cant_log_in')}
            </Button>
          </Body>
          <Footer>
            <Button
              testID="LoginButton"
              type="base"
              disabled={!this.state.password && !this.state.username_or_email}
              loading={this.state.loading}
              onPress={this.handleFormSubmit}
              style={styles.buttonContainerAlt}
            >
              {t('login.log_in_button')}
            </Button>
            <Button
              type="text"
              onPress={this.handleSignupButton}
              style={styles.buttonContainerAlt}
            >
              {t('login.new_sign_up')}
            </Button>
            <Button type="text" onPress={this.handleBypassButton}>
              {t('login.skip_sign_up')}
            </Button>
          </Footer>
        </Body>
      </Layout>
    );
  }
}
const IS_SMALL = dimensions.height <= breakpoints.height.S;
const LOGO_SIZE = IS_SMALL
  ? dimensions.height * 0.15
  : dimensions.height * 0.18;
const styles = StyleSheet.create({
  body: {
    paddingHorizontal: IS_SMALL ? 10 : 20,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    resizeMode: 'contain',
  },
  errorMessageContainer: {
    backgroundColor: '#ff6161',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    margin: IS_SMALL ? 10 : 20,
  },
  errorMessage: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  title: {
    color: '#fff',
    marginTop: IS_SMALL ? 8 : 10,
    fontSize: IS_SMALL ? 26 : 40,
    fontWeight: '100',
    textAlign: 'center',
  },
  network: {
    color: '#fff',
    textAlign: 'center',
  },
  buttonContainerAlt: {
    marginVertical: IS_SMALL ? 10 : 20,
  },
});
