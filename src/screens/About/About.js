import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Link from 'components/Link';
import { Layout } from 'components/Base';
import { t } from 'translations/i18n';

export default class About extends Component {
  render() {
    return (
      <Layout>
        <View style={styles.container}>
          <View style={styles.content}>
            <Link
              icon={require('assets/telegram.png')}
              title={t('about.social.telegram')}
              to="https://t.me/hoardinvest"
              external={true}
            />
            <Link
              icon={require('assets/blog.png')}
              title={t('about.social.blog')}
              to="https://blog.hoard.com"
              external={true}
            />
            <Link
              icon={require('assets/twitter.png')}
              title={t('about.social.twitter')}
              to="https://twitter.com/hoard"
              external={true}
            />
            <Link
              icon={require('assets/facebook.png')}
              title={t('about.social.facebook')}
              to="https://facebook.com/hoardinvest"
              external={true}
            />
            <Link
              icon={require('assets/linkedin.png')}
              title={t('about.social.linkedin')}
              to="https://linkedin.com/company/hoardinvest"
              external={true}
            />
            <Link
              icon={require('assets/reddit.png')}
              title={t('about.social.reddit')}
              to="https://reddit.com/r/hoardinvest"
              external={true}
            />
            <Link
              icon={require('assets/thumbs_up.png')}
              title={t('about.social.open_source_thanks')}
              to="OpenSource"
            />
            <Link title={t('about.social.release_notes')} to="ReleaseNotes" />
          </View>
        </View>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
});
