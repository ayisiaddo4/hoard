import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

import Button from 'components/Button';
import Input from 'components/Input';
import T from 'components/Typography';

import { t } from 'translations/i18n';

export default class InputList extends Component {
  static propTypes = {
    answers: PropTypes.arrayOf(PropTypes.string).isRequired,
    offset: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    updateAnswers: PropTypes.func.isRequired,
    saveAndContinue: PropTypes.func.isRequired,
  };

  constructor(props) {
    super();

    this.state = {
      completed: this.isCompleted(props.answers),
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.answers !== this.props.answers) {
      this.setState({
        completed: this.isCompleted(newProps.answers),
      });
    }
  }

  getRef = c => (this.scrollView = c);

  isCompleted = answers => {
    return answers.every(v => !!v);
  };

  updateAnswer = i => answer => {
    const answers = [
      ...this.props.answers.slice(0, i),
      answer,
      ...this.props.answers.slice(i + 1),
    ];

    this.props.updateAnswers(answers);
  };

  handleNextButton = () => {
    this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
    this.props.saveAndContinue();
  };

  render() {
    const { answers, offset, onCancel } = this.props;
    const { completed } = this.state;

    return (
      <View style={styles.container}>
        <T.Heading style={styles.headingStyle}>
          {t('wallet.input_seed_phrase_heading')}
        </T.Heading>
        <ScrollView
          bounces={false}
          style={styles.bodyContainer}
          ref={this.getRef}
        >
          {answers.map((answer, i) => {
            return (
              <Input
                key={i}
                style={styles.input}
                autoCapitalize="none"
                returnKeyType="next"
                placeholder={t('wallet.input_seed_phrase_word', {
                  word_number: i + offset,
                })}
                value={answer}
                onChangeText={this.updateAnswer(i)}
                type="underline"
              />
            );
          })}
          <View style={styles.footerContainer}>
            <T.Light
              style={{
                color: 'lightgrey',
                textAlign: 'center',
                paddingBottom: 10,
              }}
            >
              {t('wallet.x_of_12_words', {
                word_number: offset + answers.length - 1,
              })}
            </T.Light>
            <Button
              style={styles.nextButton}
              disabled={!completed}
              onPress={this.handleNextButton}
            >
              {t('actions.next')}
            </Button>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headingStyle: {
    padding: 20,
    paddingTop: 40,
    color: '#ffffff',
  },
  bodyContainer: {
    padding: 20,
    flexGrow: 1,
  },
  footerContainer: {
    padding: 20,
    marginTop: 20,
  },
  input: {},
  nextButton: {},
});
