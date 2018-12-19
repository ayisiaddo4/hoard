import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import SuccessFailureScreen, {TYPE_FAILURE} from 'components/SuccessFailureScreen';

import Button from 'components/Button';
import T from 'components/Typography';
import { t } from 'translations/i18n';

export default class Confirm extends Component {
  static propTypes = {
    answers: PropTypes.arrayOf(PropTypes.string).isRequired,
    testWallet: PropTypes.func.isRequired,
    saveWallet: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired
  };

  state = {
    error: false
  };

  checkWallet = () => {
    try {
      this.props.testWallet(this.props.answers);
    } catch(e) {
      return this.setState({
        error: true
      });
    }

    this.props.saveWallet(this.props.answers);
  }

  handleGoBack = () => {
    this.props.goBack();
  };

  render() {
    if (this.state.error) {
      return (
        <SuccessFailureScreen
          type={TYPE_FAILURE}
          title={t('wallet.import_title_error')}
          mainButtonText={t('wallet.import_retry')}
          onPressMain={this.props.goBack}
        />
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <T.Heading style={{ color: '#ffffff' }}>
            {t('wallet.confirm_word_list')}
          </T.Heading>
        </View>
        <View style={styles.bodyContainer}>
          <T.Light>{t('wallet.confirm_word_list_description')}</T.Light>
          {this.props.answers.map((answer, i) => (
            <T.Light style={styles.answer} key={i}>
              <T.SemiBold>
                {answer}
              </T.SemiBold>
            </T.Light>
          ))}
          <Button
            type="primary"
            style={styles.statusCheck}
            disabled={this.state.error}
            onPress={this.checkWallet}
          >
            {t('wallet.confirm_looks_good')}
          </Button>
          <Button
            type={this.state.error ? 'primary' : 'text'}
            style={styles.textButton}
            onPress={this.handleGoBack}
          >
            {t('wallet.confirm_back_text')}
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  answer: {},
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#223252',
  },
  bodyContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 0,
  },
  statusCheck: {
    marginTop: 40,
  },
  textButton: {
    marginTop: 20,
    marginBottom: 20,
  },
});
