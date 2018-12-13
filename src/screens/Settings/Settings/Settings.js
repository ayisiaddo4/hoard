import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, Switch, Alert, Linking } from 'react-native';

import { Layout, Body } from 'components/Base';
import { t } from 'translations/i18n';
import { toTitleCase } from 'lib/string-helpers';
import { enablePushNotifications } from 'screens/Settings/helpers';

import Link from 'components/Link';

export default class Settings extends Component {
  static propTypes = {
    isSignedIn: PropTypes.bool,
    enablePushNotifications: PropTypes.bool,
    updateEnablePushNotifications: PropTypes.func.isRequired,
  };

  state = {
    pushNotifications: {
      isEnabled: this.props.enablePushNotifications,
      isSupported: true,
    },
  };

  handleToggle = value => {
    if (!this.state.pushNotifications.isSupported) {
      Alert.alert(
        null,
        `${t('settings.enable_feature_in_settings')}`,
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
      pushNotifications: { ...this.state.pushNotifications, isEnabled: value },
    };

    this.setState(nextState, async () => {
      const result = await enablePushNotifications(value);
      this.props.updateEnablePushNotifications(result);
      this.setState({
        pushNotifications: {
          ...this.state.pushNotifications,
          isEnabled: result,
        },
      });
    });
  };

  render() {
    return (
      <Layout preload={false}>
        <Body scrollable style={styles.content}>
          <Link
            title={t('settings.enable_push_notifications_title')}
            onPress={this.handleToggle}
            arrowOverride={
              <Switch
                // disabled={!this.state.pushNotifications.isSupported}
                trackColor="#00DC40"
                onValueChange={this.handleToggle}
                value={this.props.enablePushNotifications}
              />
            }
          />

          <Link title={t('settings.security')} to="Security" />
          {this.props.isSignedIn && (
            <Link title={t('profile.title')} to="Profile" />
          )}
        </Body>
      </Layout>
    );
  }
}

Settings.propTypes = {
  updateEnablePushNotifications: PropTypes.func.isRequired,
  enablePushNotifications: PropTypes.bool.isRequired,
  isSignedIn: PropTypes.bool,
};

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
});
