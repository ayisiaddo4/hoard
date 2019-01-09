import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import { Layout, Body, Header, Footer } from 'components/Base';
import Button from 'components/Button';
import Input from 'components/Input';
import T from 'components/Typography';
import { t } from 'translations/i18n';
import memoize from 'lodash/memoize';

const initialStateQuestion = {
  value: '',
  confirmed: false,
  showConfirmationStatus: false,
  answer: '',
  number: null,
};

export default class Confirm extends Component {
  static propTypes = {
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
    saveWallet: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  };

  state = {
    loading: false,
    allChecksPassed: false,
    questions: [],
  };

  static getDerivedStateFromProps(props, state) {
    if (state.questions.length !== props.list.length) {
      if (__DEV__) {
        //eslint-disable-next-line no-console
        console.log(
          'The words you need are',
          ...props.list.map(item => item.word)
        );
      }

      return {
        questions: props.list.map(item => ({
          ...initialStateQuestion,
          answer: item.word,
          number: item.i + 1,
        })),
      };
    }
    return null;
  }

  componentDidMount() {
    this.setNavigation();
  }

  setNavigation = () => {
    this.props.navigation.setParams({
      leftAction: this.props.goBack,
    });
  };

  updateFormField = memoize(index => value =>
    this.setState({
      questions: [
        ...this.state.questions.slice(0, index),
        {
          ...this.state.questions[index],
          showConfirmationStatus: false,
          value,
        },
        ...this.state.questions.slice(index + 1),
      ],
    })
  );

  checkField = memoize(index => () => {
    const item = this.state.questions[index];
    this.setState(
      {
        questions: [
          ...this.state.questions.slice(0, index),
          {
            ...item,
            confirmed: item.answer === item.value,
            showConfirmationStatus: true,
          },
          ...this.state.questions.slice(index + 1),
        ],
      },
      this.checkFormState
    );
  });

  checkFormState = () =>
    this.setState({
      allChecksPassed: this.state.questions.reduce(
        (allChecksPassed, item) => allChecksPassed && item.confirmed,
        true
      ),
    });

  handleCreate = () =>
    this.setState({ loading: true }, () =>
      requestAnimationFrame(() => {
        this.props.navigation.setParams({ header: null });
        this.props.saveWallet();
      })
    );

  render() {
    return (
      <Layout preload={false}>
        <Body scrollable style={styles.body}>
          <Header>
            <T.Heading style={styles.headingStyle}>
              {t('wallet.confirm_word_list')}
            </T.Heading>
          </Header>
          <Body>
            <T.Light style={styles.text}>
              {t('wallet.confirm_word_list_check')}
            </T.Light>
            {this.state.questions.map((question, i) => (
              <Input
                key={question.number}
                style={question.confirmed && styles.inputSuccess}
                type="underline"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder={t('wallet.input_confirm_word', {
                  word_number: question.number,
                })}
                returnKeyType="next"
                onChangeText={this.updateFormField(i)}
                onEndEditing={this.checkField(i)}
                editable={!question.confirmed}
                value={question.value}
                error={
                  question.showConfirmationStatus &&
                  !question.confirmed &&
                  t('wallet.input_confirm_error')
                }
              />
            ))}
          </Body>
          <Footer>
            <Button
              type="base"
              style={styles.statusCheck}
              onPress={this.handleCreate}
              loading={this.state.loading}
              disabled={!this.state.allChecksPassed}
            >
              {t('wallet.create_my_wallet')}
            </Button>
          </Footer>
        </Body>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 20,
  },
  text: {
    color: '#fff',
    fontWeight: '300',
    fontSize: 16,
  },
  inputSuccess: {
    borderBottomColor: '#59C041',
  },
  headingStyle: {
    paddingVertical: 20,
    color: '#fff',
  },
  statusCheck: {
    marginTop: 40,
  },
});
