import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';

import SuccessFailureScreen, {
  TYPE_FAILURE,
} from 'components/SuccessFailureScreen';
import Button from 'components/Button';
import T from 'components/Typography';
import { t } from 'translations/i18n';
const LANG_PREV_TEXT = 'Go back and review...';

export default class Confirm extends Component {
  static propTypes = {
    answers: PropTypes.arrayOf(PropTypes.string).isRequired,
    testWallet: PropTypes.func.isRequired,
    saveWallet: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  };

  state = {
    error: false,
  };

  checkWallet = () => {
    const formattedAnswers = this.props.answers.map(
      answer => answer && answer.trim().toLowerCase()
    );

    try {
      this.props.testWallet(formattedAnswers);
    } catch (e) {
      return this.setState({
        error: true,
      });
    }

    this.props.saveWallet(formattedAnswers);
  };

  handleGoBack = () => {
    this.props.goBack();
  };

  render() {
    if (this.state.error) {
      return (
        <SuccessFailureScreen
          type={TYPE_FAILURE}
          title={t('wallet.error_title')}
          mainButtonText="Retry"
          onPressMain={this.handleGoBack}
        />
      );
    }

    return (
      <View style={styles.container}>
        <T.Heading style={styles.heading}>
          {t('wallet.confirm_word_list')}
        </T.Heading>
        <View style={styles.bodyContainer}>
          <T.Light style={styles.description}>
            {t('wallet.confirm_word_list_description')}
          </T.Light>
          {this.props.answers.map((answer, i) => (
            <T.SemiBold style={styles.answer} key={i}>
              {answer}
            </T.SemiBold>
          ))}
          <Button
            style={styles.statusCheck}
            disabled={this.state.error}
            onPress={this.checkWallet}
          >
            {t('wallet.confirm_looks_good')}
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputRow: {
    marginTop: 20,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  inputWrapper: {
    flexGrow: 1,
    flexDirection: 'column',
  },
  animationWrapper: {},
  animation: {
    width: 70,
    height: 50,
  },
  input: {
    flexGrow: 1,
  },
  answer: {
    color: 'lightgrey',
  },
  container: {
    flex: 1,
  },
  heading: {
    padding: 20,
    paddingTop: 40,
    color: '#fff',
  },
  bodyContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 0,
  },
  description: {
    color: 'white',
    paddingBottom: 20,
  },
  statusCheck: {
    marginTop: 40,
  },
  footerContainer: {
    padding: 20,
  },
  mnemonicChoice: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#223252',
    marginBottom: 20,
    flexDirection: 'column',
  },
  mnemonicChoiceNumner: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 12,
  },
  mnemonicChoiceText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 14,
  },
  textButton: {
    marginTop: 20,
    marginBottom: 20,
  },
});
