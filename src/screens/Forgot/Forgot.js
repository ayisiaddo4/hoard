import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {StyleSheet,Image } from 'react-native';

import { FORGOT_PASSWORD, FORGOT_USERNAME } from 'screens/Forgot/constants';
import NavigatorService from 'lib/navigator';

import { Layout, Header, Footer } from 'components/Base';
import T from 'components/Typography';
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
    NavigatorService.navigate('ForgotModal', {type: FORGOT_PASSWORD});
  };
  handleForgotUsernameModal = () => {
    NavigatorService.navigate('ForgotModal', {type: FORGOT_USERNAME});
  };

  render() {
    const imgSrc = require('assets/forgot-password.png');

    return (
      <Layout preload={false} style={styles.container} keyboard>

          <Header style={{ alignItems: 'center', marginBottom: 20}}>
            <Image style={styles.icon} source={imgSrc} />
            <T.Heading style={styles.heading}>{`Can't Log In?`}</T.Heading>
            <T.Heading style={styles.subheading}>Forgot your username or password? Retrieve your username or reset your password below.</T.Heading>
          </Header>

        <Footer>
          <Button
            type="base"
            onPress={this.handleForgotUsernameModal}
          >
            Forgot Username?
          </Button>
          <Button
            type="base"
            onPress={this.handleForgotPasswordModal}
            style={styles.button}
            >
              Forgot Password?
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
  button: {marginVertical: 40},
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
    letterSpacing: 0.75
  },
});
