import React from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, Switch } from 'react-native';

import { Layout, Body, Footer } from 'components/Base';
import T from 'components/Typography';
import Link from 'components/Link';

export default function Settings(props) {
  return (
    <Layout preload={false}>
      <Body scrollable style={styles.content}>
        <Link title="Seed Words" to="SeedWords" />
        <Link
          title="Push Notifications"
          onPress={() =>
            props.updateEnablePushNotifications(!props.enablePushNotifications)
          }
          arrowOverride={
            <Switch
              onTintColor="#00DC40"
              onValueChange={value =>
                props.updateEnablePushNotifications(value)
              }
              value={props.enablePushNotifications}
            />
          }
        />
      </Body>
      <Footer>
        <T.Light style={styles.debug}></T.Light>
      </Footer>
    </Layout>
  );
}

Settings.propTypes = {
  updateEnablePushNotifications: PropTypes.func.isRequired,
  enablePushNotifications: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  debug: {
    fontSize: 20,
    color: 'red',
    padding: 50
  }
});
