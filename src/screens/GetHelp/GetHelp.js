import React from 'react';
import { View, StyleSheet } from 'react-native';
import Link from 'components/Link';
import { Layout } from 'components/Base';
import { t } from 'translations/i18n';

export default function GetHelp() {
  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.content}>
          <Link
            external
            title={t('get_help.get_help.faq_link')}
            to="https://support.hoard.com/hc/en-us/sections/360000948793-FAQ"
          />
          <Link
            external
            title={t('get_help.get_help.contact_link')}
            to="mailto:support@hoard.com"
          />
          <Link
            title={t('get_help.get_help.ticket_link')}
            to="CreateSupportTicket"
          />
          <Link
            external
            title={t('get_help.get_help.support_link')}
            to="https://support.hoard.com"
          />
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
});
