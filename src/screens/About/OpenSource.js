import React from 'react';
import { StyleSheet } from 'react-native';
import T from 'components/Typography';
import { Layout, Body } from 'components/Base';
import { t } from 'translations/i18n';

export default function OpenSource() {
  return (
    <Layout preload={false} keyboard>
      <Body scrollable style={styles.body}>
        <Body>
          <T.Heading style={[styles.type, styles.header]}>
            {t('about.open_source.thanks')}
          </T.Heading>
          <T.Paragraph style={styles.type}>
            {t('about.open_source.thanks_projects')}
          </T.Paragraph>
        </Body>
      </Body>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginVertical: 35,
  },
  body: {
    padding: 20,
  },
  type: {
    color: 'white',
    lineHeight: 26,
  },
});
