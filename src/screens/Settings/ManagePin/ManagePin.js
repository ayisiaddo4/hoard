import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import { Layout, Body } from 'components/Base';
import Link from 'components/Link';

import { t } from 'translations/i18n';

export default function ManagePin(props) {
  return (
    <Layout preload={false}>
      <Body scrollable style={styles.content}>
        <Link title={t('manage_pin.update_pin')} to="UpdatePin" />
      </Body>
    </Layout>
  );
}

ManagePin.propTypes = {
  isSignedIn: PropTypes.bool,
};

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
});
