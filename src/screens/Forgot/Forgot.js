import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Image } from 'react-native';

import { FORGOT_PASSWORD, FORGOT_USERNAME } from 'screens/Forgot/constants';
import NavigatorService from 'lib/navigator';

import { Layout, Header, Footer } from 'components/Base';
import T from 'components/Typography';
import { t } from 'translations/i18n';
import Button from 'components/Button';

export default class Forgot extends Component {
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

  handleForgotPasswordModal = () => {
    NavigatorService.navigate('ForgotModal', { type: FORGOT_PASSWORD });
  };
  handleForgotUsernameModal = () => {
    NavigatorService.navigate('ForgotModal', { type: FORGOT_USERNAME });
  };

  render() {
    const imgSrc = require('assets/forgot-password.png');

    return (
      <Layout style={styles.container} keyboard>
        <Header style={{ alignItems: 'center', marginBottom: 20 }}>
          <Image style={styles.icon} source={imgSrc} />
          <T.Heading style={styles.heading}>{t('login.cant_log_in')}</T.Heading>
          <T.Heading style={styles.subheading}>
            {t('forgot.instructions')}
          </T.Heading>
        </Header>

        <Footer>
          <Button type="base" onPress={this.handleForgotUsernameModal}>
            {t('forgot.forgot_username')}
          </Button>
          <Button
            type="base"
            onPress={this.handleForgotPasswordModal}
            style={styles.button}
          >
            {t('forgot.forgot_password')}
          </Button>
        </Footer>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  icon: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginTop: 10,
    marginRight: 10,
  },
  button: { marginVertical: 40 },
  heading: {
    marginTop: 20,
    color: 'white',
    fontWeight: '500',
  },
  subheading: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: 'white',
    fontWeight: '200',
    letterSpacing: 0.75,
  },
});
