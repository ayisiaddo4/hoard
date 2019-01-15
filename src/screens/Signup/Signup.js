import React, { Component } from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import memoize from 'lodash/memoize';

import { StyleSheet, View, TextInput } from 'react-native';
import { Try } from 'components/Conditional';

import { Layout, Body, Header, Footer } from 'components/Base';
import { colors } from 'styles';
import Input from 'components/Input';
import Button from 'components/Button';
import T from 'components/Typography';
import { t } from 'translations/i18n';

export default class Signup extends Component {
  static propTypes = {
    navigation: PropTypes.any,
    signupRequest: PropTypes.func.isRequired,
  };

  state = {
    answers: {
      first_name: '',
      last_name: '',
      phone_number: '',
      username: '',
      email_address: '',
      password: '',
      passwordConfirmation: '',
    },
    errors: {
      first_name: '',
      last_name: '',
      phone_number: '',
      username: '',
      email_address: '',
      password: '',
      passwordConfirmation: '',
    },
    errorMessage: '',
    showErrors: false,
    showPasswordsMatch: false,
    loading: false,
    loggedIn: false,
  };

  // Setup References for focusable inputs
  signupFirstNameInput = React.createRef();
  signupLastNameInput = React.createRef();
  signupEmailAddressInput = React.createRef();
  signupPhoneInput = React.createRef();
  signupUsernameInput = React.createRef();
  signupPasswordInput = React.createRef();
  signupPasswordConfirmationInput = React.createRef();

  static getDerivedStateFromProps(props, state) {
    if (state.loading && !props.signup.requesting && !props.signup.successful) {
      return {
        loading: false,
        errorMessage: props.signup.error,
      };
    }
    return null;
  }

  handleLogInButton = () => {
    this.props.navigation.navigate('Login');
  };

  handleFormSubmit = () => {
    const { answers, errors } = this.state;

    if (find(errors)) {
      return this.setState({
        showErrors: true,
      });
    }

    this.setState({ loading: true }, () =>
      this.props.signupRequest(this.formatAnswers(answers))
    );
  };

  updateFormField = fieldName => text => {
    const answers = {
      ...this.state.answers,
      [fieldName]: text,
    };

    this.setState({
      answers,
      errors: this.validate(answers),
      showPasswordsMatch:
        this.state.showPasswordsMatch || fieldName === 'passwordConfirmation',
    });
  };

  validate = answers => {
    return {
      username:
        (!answers.username && t('signup.username_required')) ||
        (answers.username.match(/[^\w]/) && t('signup.username_valid')) ||
        ((answers.username.length > 18 || answers.username.length < 3) &&
          t('signup.username_length')) ||
        '',
      email_address:
        (!answers.email_address && t('signup.email_required')) ||
        (!answers.email_address.match(
          /^[a-zA-Z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$/
        ) &&
          t('signup.email_valid')) ||
        '',
      password:
        (!answers.password && t('signup.password_required')) ||
        answers.password !== answers.passwordConfirmation ||
        '',
      passwordConfirmation:
        (!answers.passwordConfirmation && t('signup.password_confirm')) ||
        (answers.password !== answers.passwordConfirmation &&
          t('signup.password_match')) ||
        '',
    };
  };

  formatAnswers = answers => ({
    ...answers,
    phone_number:
      answers.phone_number &&
      answers.phone_number.replace(/[-N*,;/#.\s()]/g, ''),
  });

  safeFocus = memoize(element => () => {
    this[element].current.focus();

    const currentlyFocusedField = TextInput.State.currentlyFocusedField();
    this.setState({ focusedInput: currentlyFocusedField });
  });

  render() {
    const { answers, errors, showErrors, showPasswordsMatch } = this.state;

    const nextEnabled =
      answers.email_address &&
      answers.username &&
      answers.password &&
      answers.password === answers.passwordConfirmation;
    const placeholderTextColor = '#808388';

    return (
      <Layout keyboard focusedInput={this.state.focusedInput}>
        <Body scrollable style={styles.body}>
          <Header>
            <T.Heading style={styles.headingText}>
              {t('signup.create_account')}
            </T.Heading>
            <T.SubHeading style={styles.subHeadingText}>
              {t('signup.create_account_description')}
            </T.SubHeading>
          </Header>
          <Body>
            <Try condition={!!this.state.errorMessage}>
              <View style={styles.errorMessageContainer}>
                <T.Light style={styles.errorMessage}>
                  {this.state.errorMessage}
                </T.Light>
              </View>
            </Try>
            <Input
              inputRef={this.signupFirstNameInput}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!this.state.loading}
              placeholder={t('signup.input_first_name')}
              placeholderTextColor={placeholderTextColor}
              returnKeyType="next"
              onSubmitEditing={this.safeFocus('signupLastNameInput')}
              onChangeText={this.updateFormField('first_name')}
              value={answers.first_name}
              error={showErrors && errors.first_name}
              type="underline"
              style={styles.input}
              onFocus={this.safeFocus('signupFirstNameInput')}
              blurOnSubmit={false}
            />
            <Input
              inputRef={this.signupLastNameInput}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!this.state.loading}
              placeholder={t('signup.input_last_name')}
              placeholderTextColor={placeholderTextColor}
              returnKeyType="next"
              onSubmitEditing={this.safeFocus('signupEmailAddressInput')}
              onChangeText={this.updateFormField('last_name')}
              value={answers.last_name}
              error={showErrors && errors.last_name}
              type="underline"
              style={styles.input}
              blurOnSubmit={false}
              onFocus={this.safeFocus('signupLastNameInput')}
            />
            <Input
              inputRef={this.signupEmailAddressInput}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!this.state.loading}
              placeholder={t('signup.input_email')}
              placeholderTextColor={placeholderTextColor}
              returnKeyType="next"
              keyboardType="email-address"
              onSubmitEditing={this.safeFocus('signupPhoneInput')}
              onChangeText={this.updateFormField('email_address')}
              value={answers.email_address}
              error={showErrors && errors.email_address}
              type="underline"
              style={styles.input}
              blurOnSubmit={false}
              onFocus={this.safeFocus('signupEmailAddressInput')}
            />
            <Input
              inputRef={this.signupPhoneInput}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!this.state.loading}
              placeholder={t('signup.input_phone_number')}
              placeholderTextColor={placeholderTextColor}
              returnKeyType="next"
              keyboardType="phone-pad"
              onSubmitEditing={this.safeFocus('signupUsernameInput')}
              onChangeText={this.updateFormField('phone_number')}
              value={answers.phone_number}
              error={showErrors && errors.phone_number}
              type="underline"
              style={styles.input}
              blurOnSubmit={false}
              onFocus={this.safeFocus('signupPhoneInput')}
            />
            <Input
              inputRef={this.signupUsernameInput}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!this.state.loading}
              placeholder={t('signup.input_username')}
              placeholderTextColor={placeholderTextColor}
              returnKeyType="next"
              onSubmitEditing={this.safeFocus('signupPasswordInput')}
              onChangeText={this.updateFormField('username')}
              value={answers.username}
              error={showErrors && errors.username}
              type="underline"
              style={styles.input}
              blurOnSubmit={false}
              onFocus={this.safeFocus('signupUsernameInput')}
            />
            <Input
              inputRef={this.signupPasswordInput}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!this.state.loading}
              placeholder={t('signup.input_password')}
              placeholderTextColor={placeholderTextColor}
              returnKeyType="go"
              secureTextEntry
              onSubmitEditing={this.safeFocus(
                'signupPasswordConfirmationInput'
              )}
              onChangeText={this.updateFormField('password')}
              value={answers.password}
              error={showErrors && errors.password}
              type="underline"
              style={styles.input}
              blurOnSubmit={false}
              onFocus={this.safeFocus('signupPasswordInput')}
            />
            <Input
              style={
                (showErrors || showPasswordsMatch) &&
                !errors.passwordConfirmation
                  ? styles.inputSuccess
                  : {}
              }
              inputRef={this.signupPasswordConfirmationInput}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!this.state.loading}
              placeholder={t('signup.input_password_confirm')}
              placeholderTextColor={placeholderTextColor}
              returnKeyType="go"
              secureTextEntry
              onSubmitEditing={this.handleFormSubmit}
              onChangeText={this.updateFormField('passwordConfirmation')}
              value={answers.passwordConfirmation}
              error={
                (showErrors || showPasswordsMatch) &&
                errors.passwordConfirmation
              }
              type="underline"
              onFocus={this.safeFocus('signupPasswordConfirmationInput')}
            />
          </Body>
          <Footer style={styles.footer}>
            <Button
              type="base"
              style={styles.submitButton}
              onPress={this.handleFormSubmit}
              loading={this.state.loading}
              disabled={!nextEnabled}
            >
              {t('actions.next')}
            </Button>
          </Footer>
        </Body>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 20,
  },
  errorMessageContainer: {
    backgroundColor: '#ff6161',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    margin: 20,
  },
  errorMessage: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 15,
  },
  inputSuccess: {
    borderBottomColor: 'green',
  },
  footer: {
    marginTop: 40,
    marginHorizontal: -20,
    marginBottom: 0,
  },
  submitButton: {
    borderRadius: 0,
  },
  headingText: {
    color: colors.white,
    marginTop: 25,
    marginBottom: 15,
  },
  subHeadingText: {
    color: colors.white,
    fontFamily: 'HelveticaNeue',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '300',
    letterSpacing: 0,
    marginBottom: 15,
  },
});
