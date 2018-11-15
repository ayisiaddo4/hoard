import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, Image, Alert} from 'react-native';
import Config from 'react-native-config';

import api from 'lib/api';
import {validateEmail} from 'lib/string-helpers';
import NavigatorService from 'lib/navigator';
import { Try } from 'components/Conditional';

import { Layout, Header, Body } from 'components/Base';
import Modal from 'components/Modal';
import T from 'components/Typography';
import { t } from 'translations/i18n';
import UnderlineInput from 'components/UnderlineInput';

import { FORGOT_PASSWORD, FORGOT_USERNAME } from 'screens/Forgot/constants';

const icon = {
  [FORGOT_PASSWORD]: require('assets/forgot-password.png'),
  [FORGOT_USERNAME]: require('assets/forgot-username.png'),
};

const apiEndpoints = {
  [FORGOT_PASSWORD]: 'password',
  [FORGOT_USERNAME]: 'forgot_username',
};

export default class ForgotModal extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      setParams: PropTypes.func.isRequired,
      state: PropTypes.shape({
        params: PropTypes.shape({
          type: PropTypes.oneOf([FORGOT_PASSWORD, FORGOT_USERNAME]),
        }),
      }),
    }),
  };

  constructor(props) {
    super(props);

    const forgotType =
      this.props.navigation.state.params &&
      this.props.navigation.state.params.type;

    this.state = {
      email_address: '',
      forgotType,
    };
  }

  handleChangeEmail = value => this.setState({ email_address: value });

  handleForgotRequest = async () => {
    const valid = await validateEmail({email_address: this.state.email_address});
    if (valid !== true) {
      Alert.alert(
        t('forgot.error_title'),
        valid.error || t('forgot.error_message_email')
      );
      return;
    }

    let ENDPOINT = apiEndpoints[this.state.forgotType];

    try {
      const response = await api.post(`${Config.EREBOR_ENDPOINT}/${ENDPOINT}`, {
        email_address: this.state.email_address,
      });

      if (response.success) {
        Alert.alert(t('forgot.error_message_email_sent'));
        NavigatorService.navigate('Login');
      } else {
        // eslint-disable-next-line no-console
        if (__DEV__) console.log('response', response);

      }
    } catch (e) {

      // eslint-disable-next-line no-console
      if (__DEV__) console.log(e);

      Alert.alert(
        `${t('forgot.apologetic_interjection_of_mild_dismay')} ${e.message}: ${e.errors && e.errors[0] && e.errors[0].message}`
      );
    }
    this.setState({
      loading: false,
    });
  };


  render() {

    return (
      <Modal>
        <Layout preload={false} keyboard>
        <Body scrollable>
          <Header style={{ alignItems: 'center' }}>
            <Image style={styles.icon} source={icon[this.state.forgotType]} />
            <Try condition={this.state.forgotType === FORGOT_PASSWORD}>
              <T.Heading style={styles.heading}>
                {t('forgot.reset_password')}
              </T.Heading>
            </Try>
            <Try condition={this.state.forgotType === FORGOT_USERNAME}>
              <T.Heading style={styles.heading}>
                {t('forgot.reset_username')}
              </T.Heading>
            </Try>
            <T.Heading style={styles.subheading}>
              {t('forgot.help_text')}
            </T.Heading>
          </Header>
          <Body style={styles.body}>
            <UnderlineInput
              style={styles.input}
              keyboardType="email-address"
              label={t('forgot.input_email')}
              onChangeText={this.handleChangeEmail}
              value={this.state.email_address}
              autoCorrect={false}
              onSubmitEditing={this.handleForgotRequest}
            />

          </Body>
        </Body>
      </Layout>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  body:{
    marginTop: 20
  },
  heading: {
    marginTop: 20,
    color: 'white',
    fontWeight: '500',
  },
  subheading: {
    fontSize: 24,
    marginTop: 20,
    color: 'white',
    fontWeight: '200',
    letterSpacing: 0.75
  },
  icon: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginTop: 10,
    marginRight: 10,
  },
});
