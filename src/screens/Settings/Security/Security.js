import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Switch } from 'react-native';
import { isBiometricsSupported } from 'screens/Settings/sagas';

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
      isSupported: false,
      type: 'Biometric',
    },
  };

  async componentDidMount() {
    const biometrics = await isBiometricsSupported();
    this.setState({ biometrics: biometrics });
  }

  handleToggle = value => {
    this.props.updateEnableBiometrics(value);
  };

  render() {
    const title = `Enable ${this.state.biometrics.type}`;
    return (
      <Layout preload={false}>
        <Body scrollable style={styles.content}>
          <Link
            title={title}
            // to="Biometrics"
            onPress={this.handleToggle}
            arrowOverride={
              <Switch
                trackColor="#00DC40"
                disabled={!this.state.biometrics.isSupported}
                onValueChange={this.handleToggle}
                value={this.props.enableBiometrics}
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
