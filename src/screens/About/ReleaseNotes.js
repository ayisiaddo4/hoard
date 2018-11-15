import React, {Fragment} from 'react';
import { View, StyleSheet, Text } from 'react-native';
import T from 'components/Typography';
import { Layout, Body } from 'components/Base';
import Config from 'react-native-config';
import { t } from 'translations/i18n';

export default function ReleaseNotes() {
  return (
    <Layout preload={false} keyboard>
      <Body scrollable style={styles.body}>
        <Body>
          <T.Heading style={[styles.type, styles.header]}>
            {t('about.release_notes.title')}
          </T.Heading>
          {Config.CURRENCY_NETWORK_TYPE !== 'main' &&
            <Fragment>
              <View style={styles.testnetWarning}>
                <View style={styles.testnetIconWrapper}>
                  <Text style={styles.testnetIcon}>!</Text>
                </View>
                <View style={styles.testnetBody}>
                  <T.SubHeading style={styles.testnetHeader}>
                    {t('about.release_notes.testnet_header')}
                  </T.SubHeading>
                  <T.Light style={styles.testnetContent}>
                    {t('about.release_notes.testnet_content')}
                  </T.Light>
                </View>
              </View>
              <View style={styles.introText}>
                <T.Light style={styles.type}>
                  {t('about.release_notes.intro_thanks')}
                </T.Light>
                <T.Light style={styles.type}>
                  {t('about.release_notes.testnet_description')}
                </T.Light>
                <T.Light style={styles.type}>
                  {t('about.release_notes.testnet_faucet')}
                </T.Light>
                <T.Light style={styles.type}>
                  {t('about.release_notes.testnet_bugs')}
                </T.Light>
                <T.Light style={styles.type}>
                  {t('about.release_notes.telegram')}
                </T.Light>
              </View>
            </Fragment>
          }
          <T.SubHeading style={styles.subheading}>
            {t('about.release_notes.release')} 1.0
          </T.SubHeading>
          <T.Light style={styles.type}>
            &bull;  🎉 🎉 🎉 🎉 🎉
          </T.Light>
        </Body>
      </Body>
    </Layout>
  );
}

const styles = StyleSheet.create({
  testnetWarning: {
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#ff6161',
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row',
  },
  testnetIconWrapper: {
    height: 40,
    width: 40,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'white',
  },
  testnetIcon: {
    color: 'white',
    fontSize: 28,
    textAlign: 'center',
  },
  testnetBody: {
    flex: 1
  },
  testnetHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  testnetContent: {
    fontSize: 12,
    color: 'white',
  },
  introText: {
  },
  header: {
  },
  subheading: {
    color: 'white',
    fontWeight: 'bold',
    marginVertical: 20
  },
  body: {
    padding: 20,
  },
  type: {
    color: 'white',
    marginBottom: 10,
  },
});
