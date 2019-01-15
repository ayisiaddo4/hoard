import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import Config from 'react-native-config';

import { Layout, Body, Header, Footer } from 'components/Base';
import { Try } from 'components/Conditional';
import Button from 'components/Button';
import Input from 'components/Input';
import T from 'components/Typography';

import api from 'lib/api';
import { colors } from 'styles';
import { t } from 'translations/i18n';

import memoize from 'lodash/memoize';

export default class ChangePassword extends Component {
  static propTypes = {
    navigation: PropTypes.any,
    username: PropTypes.string.isRequired,
  };

  state = {
    inputsHaveBlurred: {
      current_password: false,
      new_password: false,
      confirm_password: false,
    },
    answers: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
    errors: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
    readyForSubmission: false,
    errorMessage: '',
    loading: false,
  };

  // Setup References for focusable inputs
  oldPasswordInput = React.createRef();
  newPasswordInput = React.createRef();
  confirmPasswordInput = React.createRef();

  updatePassword = async ({ username, current_password, new_password }) => {
    try {
      await api.post(`${Config.EREBOR_ENDPOINT}/change_password`, {
        username_or_email: username,
        password: current_password,
        new_password,
      });

      this.setState({
        successfulSubmission: true,
        loading: false,
      });
    } catch (e) {
      this.setState({
        errorMessage: e.errors[0].message,
        loading: false,
      });
    }
  };

  handleFormSubmit = () => {
    const { current_password, new_password } = this.state.answers;

    this.setState(
      { loading: true, errorMessage: '', successfulSubmission: false },
      () =>
        this.updatePassword({
          username: this.props.username,
          current_password,
          new_password,
        })
    );
  };

  updateFormField = fieldName => text => {
    const answers = {
      ...this.state.answers,
      [fieldName]: text,
    };

    const errors = this.checkForErrors(answers, this.state.inputsHaveBlurred);
    const readyForSubmission = this.isReadyForSubmission(answers, errors);

    this.setState({
      answers,
      errors,
      readyForSubmission,
    });
  };

  handleBlur = fieldName => {
    return () => {
      const inputsHaveBlurred = {
        ...this.state.inputsHaveBlurred,
        [fieldName]: true,
      };
      const errors = this.checkForErrors(this.state.answers, inputsHaveBlurred);
      const readyForSubmission = this.isReadyForSubmission(
        this.state.answers,
        errors
      );

      this.setState({
        inputsHaveBlurred,
        errors,
        readyForSubmission,
      });
    };
  };

  safeFocus = memoize(element => () => {
    this[element].current.focus();
  });

  checkForErrors = (answers, inputsHaveBlurred) => {
    const currentPasswordError = answers.current_password.length
      ? ''
      : t('change_password.errors.current_password_required');

    const newPasswordError = answers.new_password.length
      ? ''
      : t('change_password.errors.empty_password');

    const confirmPasswordActive =
      inputsHaveBlurred.confirm_password || answers.confirm_password.length;
    const confirmPasswordMatch =
      answers.confirm_password === answers.new_password
        ? ''
        : t('change_password.errors.password_match');
    const confirmPasswordError = answers.confirm_password.length
      ? confirmPasswordMatch
      : t('change_password.errors.empty_password');

    return {
      current_password:
        inputsHaveBlurred.current_password && currentPasswordError,
      new_password: inputsHaveBlurred.new_password && newPasswordError,
      confirm_password: confirmPasswordActive && confirmPasswordError,
    };
  };

  isReadyForSubmission = (answers, errors) => {
    const allInputsFilled =
      answers.current_password &&
      answers.new_password &&
      answers.confirm_password;
    const hasAnyErrors =
      errors.current_password || errors.new_password || errors.confirm_password;
    return !!allInputsFilled && !hasAnyErrors;
  };

  render() {
    const { answers, errors, readyForSubmission } = this.state;
    const placeholderTextColor = 'rgba(255,255,255,0.75)';

    return (
      <Layout keyboard>
        <Body scrollable style={styles.body}>
          <Header>
            <T.Heading style={styles.headingText}>
              {t('change_password.title')}
            </T.Heading>
            <T.SubHeading style={styles.headingText}>
              {t('change_password.subtitle')}
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
            <Try condition={!!this.state.successfulSubmission}>
              <View
                style={[
                  styles.errorMessageContainer,
                  styles.successMessageContainer,
                ]}
              >
                <T.Light style={styles.errorMessage}>
                  {t('change_password.success_message')}
                </T.Light>
              </View>
            </Try>
            <Input
              inputRef={this.oldPasswordInput}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!this.state.loading}
              secureTextEntry={true}
              placeholder={t('change_password.current_password')}
              placeholderTextColor={placeholderTextColor}
              returnKeyType="next"
              onSubmitEditing={this.safeFocus('newPasswordInput')}
              onChangeText={this.updateFormField('current_password')}
              onEndEditing={this.handleBlur('current_password')}
              value={answers.current_password}
              error={errors.current_password}
              type="underline"
              style={styles.input}
              blurOnSubmit={false}
            />
            <Input
              inputRef={this.newPasswordInput}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!this.state.loading}
              secureTextEntry={true}
              placeholder={t('change_password.new_password')}
              placeholderTextColor={placeholderTextColor}
              returnKeyType="next"
              onSubmitEditing={this.safeFocus('confirmPasswordInput')}
              onChangeText={this.updateFormField('new_password')}
              onEndEditing={this.handleBlur('new_password')}
              value={answers.new_password}
              error={errors.new_password}
              type="underline"
              style={styles.input}
              blurOnSubmit={false}
            />
            <Input
              inputRef={this.confirmPasswordInput}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!this.state.loading}
              secureTextEntry={true}
              placeholder={t('change_password.confirm_password')}
              placeholderTextColor={placeholderTextColor}
              returnKeyType="next"
              onSubmitEditing={this.handleFormSubmit}
              onChangeText={this.updateFormField('confirm_password')}
              onEndEditing={this.handleBlur('confirm_password')}
              value={answers.confirm_password}
              error={errors.confirm_password}
              type="underline"
              style={styles.input}
            />
          </Body>
        </Body>
        {readyForSubmission && (
          <Footer>
            <Button
              type="base"
              disabled={this.state.loading}
              style={styles.updateButton}
              onPress={this.handleFormSubmit}
            >
              {t('actions.update')}
            </Button>
          </Footer>
        )}
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 20,
    marginBottom: -20,
  },
  successMessageContainer: {
    backgroundColor: '#00C51E',
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
  headingText: {
    color: colors.white,
    marginTop: 25,
    marginBottom: 15,
  },
  updateButton: {
    borderRadius: 0,
    marginBottom: -20,
  },
});
