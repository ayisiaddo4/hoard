import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Layout, Body, Header, Footer } from 'components/Base';
import memoize from 'lodash/memoize';

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

  safeFocus = memoize(element => () => {
    const currentlyFocusedField = TextInput.State.currentlyFocusedField();
    this.setState({ focusedInput: currentlyFocusedField });
    this[element].current.focus();
  });

  handleNextButton = () => {
    this.props.saveAndContinue();
  };

  render() {
    const { answers, offset, onCancel } = this.props;
    const { completed } = this.state;

    const RENDER_INPUTS = [];

    answers.forEach((answer, i) => {
      const nextInput =
        i === 5
          ? `input${i + offset}`
          : i < answers.length - 1
          ? `input${i + offset + 1}`
          : `input${i + offset}`;

      this[`input${i + offset}`] = React.createRef();

      RENDER_INPUTS.push(
        <Input
          inputRef={this[`input${i + offset}`]}
          key={i + offset + 'key'}
          style={styles.input}
          autoCapitalize="none"
          returnKeyType="next"
          placeholder={t('wallet.input_seed_phrase_word', {
            word_number: i + offset,
          })}
          value={answer}
          onSubmitEditing={
            i === answers.length - 1
              ? this.handleNextButton
              : this.safeFocus(nextInput)
          }
          onChangeText={this.updateAnswer(i)}
          type="underline"
          blurOnSubmit={false}
          onFocus={this.safeFocus(`input${i + offset}`)}
        />
      );
    });

    return (
      <Layout preload={false} keyboard focusedInput={this.state.focusedInput}>
        <T.Heading style={styles.headingStyle}>
          {t('wallet.input_seed_phrase_heading')}
        </T.Heading>
        <Body scrollable style={styles.bodyContainer} navigationOffset={80}>
          {RENDER_INPUTS}
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
        </Body>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
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
