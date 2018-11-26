import React, { Component } from 'react';

import PropTypes from 'prop-types';
import invoke from 'lodash/invoke';
import memoize from 'lodash/memoize';

import { StyleSheet, View } from 'react-native';
import { Try } from 'components/Conditional';
import LoadingSpinner from 'components/LoadingSpinner';
import Button from 'components/Button';

import { Layout, Body, Header } from 'components/Base';
import { colors, calculateHitSlop } from 'styles';
import Input from 'components/Input';
import T from 'components/Typography';
import Config from 'react-native-config';
import {setUser} from 'sagas/authentication';
import {t} from 'translations/i18n';

import api from 'lib/api';

const initialState = {
  answers: {
    first_name: '',
    last_name: '',
    phone_number: '',
  },
  errorMessage: '',
  loading: false,
};


export default class Profile extends Component {
  static propTypes = {
    navigation: PropTypes.any,
    user: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      phone_number: PropTypes.string,
      username: PropTypes.string.isRequired,
      email_address: PropTypes.string.isRequired,
      user_uid: PropTypes.string.isRequired,
    }).isRequired,
    updateUser: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const {
      first_name,
      last_name,
      phone_number,
    } = props.user;

    this.state = {
      ...initialState,
      answers: {
        ...initialState.answers,
        first_name: first_name || '',
        last_name: last_name || '',
        phone_number: phone_number || '',
      },
    };
  }

  updateUser = (newUser) => {
    api.put(`${Config.EREBOR_ENDPOINT}/users/${this.props.user.user_uid}`, newUser).then(
      async () => {
        await this.props.updateUser(newUser);
        await setUser({...this.props.user, ...newUser});
        this.setState({loading: false, errorMessage: ''}, this.checkSavedState);
      },
      (error) => {
        this.setState(
          {
            loading: false,
            errorMessage: error && error.errors && error.errors[0] && error.errors[0].message
          },
          this.checkSavedState
        );
      }
    );
  }

  handleFormSubmit = () => {
    this.props.navigation.setParams({rightAction: this.makeSaveButton(true)});

    this.setState({ loading: true }, () => this.updateUser({
      username: this.props.user.username,
      email_address: this.props.user.email_address,
      first_name: this.state.answers.first_name,
      last_name: this.state.answers.last_name,
      phone_number: this.state.answers.phone_number,
    }));
  };

  updateFormField = fieldName => text => {
    const answers = {
      ...this.state.answers,
      [fieldName]: text,
    };

    this.setState({answers}, this.checkSavedState);
  };

  makeSaveButton = (loading) => (
    <Button
      type="text"
      style={styles.saveButton}
      loading={loading}
      onPress={this.handleFormSubmit}
    >
      {t('actions.save')}
    </Button>
  )

  checkSavedState = () => {
    if (this.isChanged(this.props.user, this.state.answers)) {
      this.props.navigation.setParams({rightAction: this.makeSaveButton(false)});
    } else {
      this.props.navigation.setParams({rightAction: null});
    }
  }

  isChanged = (oldUser, newUser) => {
    const firstNameChanged = oldUser.first_name !== newUser.first_name;
    const lastNameChanged = oldUser.last_name !== newUser.last_name;
    const phoneNumberChanged = oldUser.phone_number !== newUser.phone_number;
    return firstNameChanged || lastNameChanged || phoneNumberChanged;
  }

  safeFocus = memoize(element => () => invoke(element, 'inputRef.focus'));

  render() {
    const { answers } = this.state;
    const placeholderTextColor = '#808388';

    return (
      <Layout preload={false} keyboard>
        <Body scrollable style={styles.body}>
          <Header>
            <T.Heading style={styles.headingText}>{t('profile.title')}</T.Heading>
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
              placeholder={t('profile.first_name')}
              placeholderTextColor={placeholderTextColor}
              returnKeyType="next"
              onSubmitEditing={this.safeFocus(this.signupLastNameInput)}
              onChangeText={this.updateFormField('first_name')}
              value={answers.first_name}
              type="underline"
              style={styles.input}
            />
            <Input
              ref={el => (this.signupLastNameInput = el)}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!this.state.loading}
              placeholder={t('profile.last_name')}
              placeholderTextColor={placeholderTextColor}
              returnKeyType="next"
              onSubmitEditing={this.safeFocus(this.signupEmailAddressInput)}
              onChangeText={this.updateFormField('last_name')}
              value={answers.last_name}
              type="underline"
              style={styles.input}
            />
            <Input
              ref={el => (this.signupUsernameInput = el)}
              autoCapitalize="none"
              autoCorrect={false}
              editable={false}
              placeholder={t('profile.username')}
              placeholderTextColor={placeholderTextColor}
              returnKeyType="next"
              onSubmitEditing={this.safeFocus(this.signupPasswordInput)}
              onChangeText={this.updateFormField('username')}
              value={this.props.user.username}
              type="underline"
              style={styles.input}
            />
            <Input
              ref={el => (this.signupEmailAddressInput = el)}
              autoCapitalize="none"
              autoCorrect={false}
              editable={false}
              placeholder={t('profile.email_address')}
              placeholderTextColor={placeholderTextColor}
              returnKeyType="next"
              keyboardType="email-address"
              onSubmitEditing={this.safeFocus(this.signupPhoneInput)}
              onChangeText={this.updateFormField('email_address')}
              value={this.props.user.email_address}
              type="underline"
              style={styles.input}
            />
            <Input
              ref={el => (this.signupPhoneInput = el)}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!this.state.loading}
              placeholder={t('profile.phone_number')}
              placeholderTextColor={placeholderTextColor}
              returnKeyType="next"
              onSubmitEditing={this.safeFocus(this.signupUsernameInput)}
              onChangeText={this.updateFormField('phone_number')}
              value={answers.phone_number}
              type="underline"
              style={styles.input}
            />
          </Body>
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
  headingText: {
    color: colors.white,
    marginTop: 25,
    marginBottom: 15,
  },
  saveButton: {
    flex: 1,
    justifyContent: 'flex-start'
  }
});
