import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { View, Image, StyleSheet } from 'react-native';
import { Layout, Body, Header, Footer } from 'components/Base';
import Button from 'components/Button';
import { Try } from 'components/Conditional';
import T from 'components/Typography';
import { t } from 'translations/i18n';
export default class SeedWordsSplash extends Component {
  static propTypes = {
    onDisplay: PropTypes.func.isRequired,
    lastDisplayTime: PropTypes.string,
  };

  render() {
    let date;
    if (this.props.lastDisplayTime) {
      date = new Date(Number(this.props.lastDisplayTime));
    }
    return (
      <Layout preload={false}>
        <Header style={styles.container}>
          <T.Heading style={styles.title}>
            {t('settings.your_seed_words')}
          </T.Heading>
        </Header>
        <Body style={[styles.container, styles.body]}>
          <Image
            style={styles.image}
            source={require('assets/seed-words.png')}
            resizeMode="contain"
          />
          <View style={styles.textContainer}>
            <T.Heading style={styles.subtitle}>
              {t('settings.your_keys')}
            </T.Heading>
            <T.Light style={styles.bodyText}>
              {t('settings.your_keys_description')}
            </T.Light>
            <T.Light style={styles.bodyText}>
              {t('settings.your_keys_description_2')}
            </T.Light>
          </View>
        </Body>
        <Footer style={styles.container}>
          <Button onPress={this.props.onDisplay} style={styles.button}>
            {t('settings.display_keys_again')}
          </Button>
          <Try condition={!!this.props.lastDisplayTime}>
            <Fragment>
              <T.Light style={styles.seedWordTop}>
                {t('settings.last_display_time')}
              </T.Light>
              <T.SemiBold style={styles.seedWordBottom}>
                {date &&
                  date.toLocaleString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
              </T.SemiBold>
            </Fragment>
          </Try>
        </Footer>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    color: '#ffffff',
  },
  subtitle: {
    fontWeight: '500',
    color: '#ffffff',
  },
  container: {
    padding: 20,
  },
  image: {
    height: undefined,
    width: undefined,
    flex: 1,
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
  },
  body: {
    paddingTop: 0,
  },
  bodyText: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
    color: '#ffffff',
  },
  button: {
    marginBottom: 20,
  },
  seedWordTop: {
    textAlign: 'center',
    color: '#ffffff',
  },
  seedWordBottom: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
