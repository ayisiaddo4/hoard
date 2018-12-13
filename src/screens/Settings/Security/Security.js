import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Switch, Alert } from 'react-native';
import { Linking } from 'react-native';
import { toTitleCase } from 'lib/string-helpers';
import {
  isBiometricsSupported,
  enableBiometrics,
} from 'screens/Settings/helpers';

import { Layout, Body } from 'components/Base';
import Link from 'components/Link';

import { t } from 'translations/i18n';
export default class Security extends Component {
  static propTypes = {
    isSignedIn: PropTypes.bool,
    enableBiometrics: PropTypes.bool,
    updateEnableBiometrics: PropTypes.func.isRequired,
  };

  state = {
    biometrics: {
      isEnabled: this.props.enableBiometrics,
      isSupported: false,
      type: t('settings.default_biometrics_title'),
    },
  };

  async componentDidMount() {
    const biometrics = await isBiometricsSupported();
    const prevBiometrics = { ...this.state.biometrics };
    this.setState({ biometrics: { ...prevBiometrics, ...biometrics } });
  }

  handleToggle = value => {
    if (this.state.biometrics.error) {
      Alert.alert(
        null,
        `${this.state.biometrics.error} ${t(
          'settings.enable_feature_in_settings'
        )}`,
        [
          {
            text: t('settings.go_to_system_settings'),
            onPress: () => Linking.openURL('app-settings:'),
          },
          {
            text: toTitleCase(t('actions.cancel')),
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );
    }
    const nextState = {
      ...this.state,
      biometrics: { ...this.state.biometrics, isEnabled: value },
    };

    this.setState(nextState, async () => {
      const result = await enableBiometrics(value);
      this.props.updateEnableBiometrics(result);
      this.setState({
        biometrics: { ...this.state.biometrics, isEnabled: result },
      });
    });
  };

  render() {
    const title = t('settings.enable_biometrics_title', {
      type: this.state.biometrics.type,
    });
    return (
      <Layout preload={false}>
        <Body scrollable style={styles.content}>
          <Link
            title={title}
            onPress={this.handleToggle}
            arrowOverride={
              <Switch
                trackColor="#00DC40"
                disabled={!this.state.biometrics.isSupported}
                onValueChange={this.handleToggle}
                value={this.state.biometrics.isEnabled}
              />
            }
          />

          <Link title={t('settings.manage_pin')} to="ManagePin" />
          <Link title={t('settings.seed_words')} to="SeedWords" />
          {this.props.isSignedIn && (
            <Link title={t('change_password.title')} to="ChangePassword" />
          )}
        </Body>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
});
