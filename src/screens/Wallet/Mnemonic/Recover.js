import ethers from 'ethers';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { t } from 'translations/i18n';
import InputList from '../components/InputList';
import ConfirmMnemonic from '../components/ConfirmMnemonic';

export default class Recover extends Component {
  static propTypes = {
    goBack: PropTypes.func.isRequired,
    saveAndContinue: PropTypes.func.isRequired,
  };

  state = {
    step: 1,
    answers: {
      step1: Array.from({ length: 6 }, () => ""),
      step2: Array.from({ length: 6 }, () => "")
    }
  };

  saveAnswers = step => stepAnswers => {
    this.setState({
      answers: {
        ...this.state.answers,
        [step]: stepAnswers
      }
    });
  };

  componentDidMount() {
    this.setNavigation(1);
  }

  setNavigation = step => {
    this.props.navigation.setParams({
      leftAction: this.goBack,
      title: t('wallet.recover_wallet'),
      multipage: true,
      currentPage: step,
      totalPages: 3,
    });
  };

  goForward = () => {
    const step = this.state.step + 1;
    this.setState(
      {
        step: step,
      },
      this.setNavigation(step)
    );
  };

  goBack = () => {
    const previousStep = this.state.step - 1;

    if (previousStep === 0) {
      this.props.navigation.setParams({
        leftAction: false,
        title: null,
        multipage: null,
        currentPage: null,
        totalPages: null,
      });

      this.props.goBack();
    } else {
      this.setState({ step: previousStep }, this.setNavigation(previousStep));
    }
  };

  testWallet = answers => {
    ethers.Wallet.fromMnemonic(answers.join(' '));
  };

  saveNewWallet = answers => this.props.saveAndContinue(answers.join(" "));

  render() {
    const { step } = this.state;

    if (step === 1) {
      return (
        <InputList
          offset={1}
          answers={this.state.answers.step1}
          updateAnswers={this.saveAnswers("step1")}
          saveAndContinue={this.goForward}
          onCancel={this.goBack}
          onBack={this.goBack}
        />
      );
    }
    if (step === 2) {
      return (
        <InputList
          offset={this.state.answers.step1.length + 1}
          answers={this.state.answers.step2}
          updateAnswers={this.saveAnswers("step2")}
          saveAndContinue={this.goForward}
          onCancel={this.goBack}
          onBack={this.goBack}
        />
      );
    }
    if (step === 3) {
      return (
        <ConfirmMnemonic
          answers={[...this.state.answers.step1, ...this.state.answers.step2]}
          testWallet={this.testWallet}
          saveWallet={this.saveNewWallet}
          goBack={this.goBack}
        />
      );
    }

    return null;
  }
}
