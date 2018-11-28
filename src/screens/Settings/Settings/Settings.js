import React from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, Switch } from 'react-native';

import { Layout, Body } from 'components/Base';
import { t } from 'translations/i18n';

import Link from 'components/Link';
import { UrbanAirship } from 'urbanairship-react-native';

export default function Settings(props) {
  return (
    <Layout preload={false}>
      <Body scrollable style={styles.content}>
        <Link
          title="Push Notifications"
          onPress={() =>
            props.updateEnablePushNotifications(!props.enablePushNotifications)
          }
          arrowOverride={
            <Switch
              trackColor="#00DC40"
              onValueChange={value => {
                UrbanAirship.setUserNotificationsEnabled(value);
                props.updateEnablePushNotifications(value);
              }}
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
