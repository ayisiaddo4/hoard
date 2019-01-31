import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Alert, Linking, StyleSheet, Switch } from 'react-native';

import { Layout, Body } from 'components/Base';
import { toTitleCase } from 'lib/string-helpers';
import { t } from 'translations/i18n';

import Link from 'components/Link';

export default class Settings extends Component {
  static propTypes = {
    updateEnablePushNotifications: PropTypes.func.isRequired,
    enablePushNotifications: PropTypes.bool.isRequired,
    isSignedIn: PropTypes.bool,
  };

  togglePushNotifications = () => {
    Alert.alert(
      null,
      t('settings.change_notifications_in_settings'),
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
  };

  render() {
    return (
      <Layout>
        <Body scrollable style={styles.content}>
          <Link
            title="Push Notifications"
            onPress={this.togglePushNotifications}
            arrowOverride={
              <Switch
                trackColor="#00DC40"
                onValueChange={this.togglePushNotifications}
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

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
});
