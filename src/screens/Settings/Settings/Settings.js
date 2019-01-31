import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, Switch } from 'react-native';

import { Layout, Body } from 'components/Base';
import { t } from 'translations/i18n';
import { setUserNotificationsEnabledOnPushService } from 'lib/notification-helpers';
import Link from 'components/Link';

export default class Settings extends Component {
  static propTypes = {
    updateEnablePushNotifications: PropTypes.func.isRequired,
    enablePushNotifications: PropTypes.bool.isRequired,
    isSignedIn: PropTypes.bool,
  };

  togglePushNotifications = async () => {
    const newValue = !this.props.enablePushNotifications;
    console.log('UA: settings.js: toggle changed to:', newValue);
    // UrbanAirship.setUserNotificationsEnabled(newValue);
    const suck = await setUserNotificationsEnabledOnPushService(newValue); // UA
    console.log('UA: settings.js: awaited the suckiness:', suck);
    this.props.updateEnablePushNotifications(newValue); // Redux
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
