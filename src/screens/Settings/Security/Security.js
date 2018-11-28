import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import { Layout, Body } from 'components/Base';
import Link from 'components/Link';

import { t } from 'translations/i18n';

export default function Security(props) {
  return (
    <Layout preload={false}>
      <Body scrollable style={styles.content}>
        <Link title={t('settings.seed_words')} to="SeedWords" />
        {props.isSignedIn && (
          <Link title={t('change_password.title')} to="ChangePassword" />
        )}
      </Body>
    </Layout>
  );
}

Security.propTypes = {
  isSignedIn: PropTypes.bool,
};

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
});
