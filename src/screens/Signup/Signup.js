import React, { Component } from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import invoke from 'lodash/invoke';
import memoize from 'lodash/memoize';

import { StyleSheet, View } from 'react-native';
import { Try } from 'components/Conditional';

import { Layout, Body, Header, Footer } from 'components/Base';
import { colors } from 'styles';
import Input from 'components/Input';
import Button from 'components/Button';
import T from 'components/Typography';

const LANG_SIGN_UP_TEXT = 'Next';

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

    this.setState({ loading: true }, () => this.props.signupRequest(this.formatAnswers(answers)));
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
        (!answers.username && 'Username is required') ||
        (answers.username.match(/[^\w]/) &&
          'Username may only include numbers, letters, and _') ||
        ((answers.username.length > 18 || answers.username.length < 3) &&
          'Username must be between 3 and 18 characters') ||
        '',
      email_address:
        (!answers.email_address && 'Email is required') ||
        (!answers.email_address.match(
          /^[a-zA-Z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$/
        ) &&
          'Must be a valid email') ||
        '',
      password:
        (!answers.password && 'Password is required') ||
        answers.password !== answers.passwordConfirmation ||
        '',
      passwordConfirmation:
        (!answers.passwordConfirmation &&
          'Password confirmation is required') ||
        (answers.password !== answers.passwordConfirmation &&
          'Your passwords do not match') ||
        '',
    };
  };

  formatAnswers = answers => ({
    ...answers,
    phone_number: answers.phone_number && answers.phone_number.replace(/[-N*,;/#.\s()]/g, '')
  })

  safeFocus = memoize(element => () => invoke(element, 'inputRef.focus'));

  render() {
    const { answers, errors, showErrors, showPasswordsMatch } = this.state;

    const nextEnabled =
      answers.email_address &&
      answers.username &&
      answers.password &&
      answers.password === answers.passwordConfirmation;
    const placeholderTextColor = 'rgba(255,255,255,0.75)';

    return (
      <Layout preload={false} keyboard>
        <Body scrollable style={styles.body}>
          <Header>
            <T.Heading style={styles.headingText}>Create Account</T.Heading>
            <T.SubHeading style={styles.subHeadingText}>
              Enter your personal information
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
              ref={el => (this.signupFirstNameInput = el)}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!this.state.loading}
              placeholder="First Name"
              placeholderTextColor={placeholderTextColor}
              returnKeyType="next"
              onSubmitEditing={this.safeFocus(this.signupLastNameInput)}
              onChangeText={this.updateFormField('first_name')}
              value={answers.first_name}
              error={showErrors && errors.first_name}
              type="underline"
              style={styles.input}
            />
            <Input
              ref={el => (this.signupLastNameInput = el)}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!this.state.loading}
              placeholder="Last Name"
              placeholderTextColor={placeholderTextColor}
              returnKeyType="next"
              onSubmitEditing={this.safeFocus(this.signupEmailAddressInput)}
              onChangeText={this.updateFormField('last_name')}
              value={answers.last_name}
              error={showErrors && errors.last_name}
              type="underline"
              style={styles.input}
            />
            <Input
              ref={el => (this.signupEmailAddressInput = el)}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!this.state.loading}
              placeholder="Email"
              placeholderTextColor={placeholderTextColor}
              returnKeyType="next"
              keyboardType="email-address"
              onSubmitEditing={this.safeFocus(this.signupPhoneInput)}
              onChangeText={this.updateFormField('email_address')}
              value={answers.email_address}
              error={showErrors && errors.email_address}
              type="underline"
              style={styles.input}
            />
            <Input
              ref={el => (this.signupPhoneInput = el)}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!this.state.loading}
              placeholder="Phone Number"
              placeholderTextColor={placeholderTextColor}
              returnKeyType="next"
              keyboardType="phone-pad"
              onSubmitEditing={this.safeFocus(this.signupUsernameInput)}
              onChangeText={this.updateFormField('phone_number')}
              value={answers.phone_number}
              error={showErrors && errors.phone_number}
              type="underline"
              style={styles.input}
            />
            <Input
              ref={el => (this.signupUsernameInput = el)}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!this.state.loading}
              placeholder="Username"
              placeholderTextColor={placeholderTextColor}
              returnKeyType="next"
              onSubmitEditing={this.safeFocus(this.signupPasswordInput)}
              onChangeText={this.updateFormField('username')}
              value={answers.username}
              error={showErrors && errors.username}
              type="underline"
              style={styles.input}
            />
            <Input
              ref={el => (this.signupPasswordInput = el)}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!this.state.loading}
              placeholder="Password"
              placeholderTextColor={placeholderTextColor}
              returnKeyType="go"
              secureTextEntry
              onSubmitEditing={this.safeFocus(
                this.signupPasswordConfirmationInput
              )}
              onChangeText={this.updateFormField('password')}
              value={answers.password}
              error={showErrors && errors.password}
              type="underline"
              style={styles.input}
            />
            <Input
              style={
                (showErrors || showPasswordsMatch) &&
                !errors.passwordConfirmation
                  ? styles.inputSuccess
                  : {}
              }
              ref={el => (this.signupPasswordConfirmationInput = el)}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!this.state.loading}
              placeholder="Re-enter Password"
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
              {LANG_SIGN_UP_TEXT}
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
