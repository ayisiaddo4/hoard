import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, Switch } from 'react-native';

import { Layout, Body } from 'components/Base';
import { t } from 'translations/i18n';

import Link from 'components/Link';
import { UrbanAirship } from 'urbanairship-react-native';

export default class Settings extends Component {
  static propTypes = {
    updateEnablePushNotifications: PropTypes.func.isRequired,
    enablePushNotifications: PropTypes.bool.isRequired,
    isSignedIn: PropTypes.bool,
  };

  togglePushNotifications = () => {
    const newValue = !this.props.enablePushNotifications;
    UrbanAirship.setUserNotificationsEnabled(newValue);
    this.props.updateEnablePushNotifications(newValue);
  };

  render() {
    return (
      <Layout preload={false}>
        <Body scrollable style={styles.content}>
          <Link
            title="Push Notifications"
            onPress={this.togglePushNotifications}
            arrowOverride={
              <Switch
                trackColor="#00DC40"
                onValueChange={this.togglePushNotifications}
                value={props.enablePushNotifications}
              />
            }
          />

          <Link title={t('settings.security')} to="Security" />
          {props.isSignedIn && <Link title={t('profile.title')} to="Profile" />}
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
