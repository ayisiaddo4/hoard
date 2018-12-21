import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import SuccessFailureScreen, {
  TYPE_SUCCESS,
} from 'components/SuccessFailureScreen';

import { initializeWallet } from '../WalletInstances';
import SelectType from './Type';
import SelectCoin from '../components/SelectCoin';
import InputList from '../components/InputList';
import PrivateKey from './PrivateKey';
import Confirm from './Confirm';
import NavigatorService from 'lib/navigator';
import { t } from 'translations/i18n';

export default class Import extends Component {
  static propTypes = {
    importWallet: PropTypes.func.isRequired,
    wallet: PropTypes.shape({
      import_successful: PropTypes.bool.isRequired,
    }).isRequired,
  };

  state = {
    step: 0,
    coin: null,
    isMnemonicPhrase: false,
    modalOpen: false,
    answers: {
      step1: Array.from({ length: 6 }, () => ''),
      step2: Array.from({ length: 6 }, () => ''),
    },
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.wallet.import_successful) {
      this.setState({ modalOpen: true });
    }
  }

  selectRecoveryOption = isMnemonicPhrase => () => {
    this.setState({ isMnemonicPhrase }, this.goForward);
  };

  selectCoin = coin => {
    if (__DEV__) {
      // eslint-disable-next-line
      console.log(
        'Test Recovery Phrase:',
        initializeWallet(coin)._wallet.mnemonic
      );

      // eslint-disable-next-line
      console.log(
        'Test Private Key:',
        initializeWallet(coin)._wallet.privateKey
      );
    }
    this.setState(
      {
        coin,
      },
      this.goForward
    );
  };

  saveAnswers = step => stepAnswers => {
    this.setState({
      answers: {
        ...this.state.answers,
        [step]: stepAnswers,
      },
    });
  };

  goForward = () => {
    const currentStep = this.state.step;
    const nextStep = currentStep < 4 ? currentStep + 1 : 1;

    this.setState({
      ...this.state,
      step: nextStep,
    });
  };

  goBack = () => {
    this.setState({
      ...this.state,
      step: 2,
    });
  };

  openModal = () => {
    this.setState({
      modalOpen: true,
    });
  };

  cancelModal = () => {
    this.setState({
      modalOpen: false,
    });
  };

  testWallet = answers => {
    initializeWallet(this.state.coin, true, answers.join(' '));
  };

  importWallet = type => seed => {
    this.props.importWallet(
      this.state.coin,
      type,
      type === 'privateKey' ? seed : seed.join(' ')
    );

    this.openModal();
  };

  handleRedirect = () => {
    NavigatorService.navigate('Wallet');
  };

  getMnemonicComponentForStep = step => {
    if (step === 2) {
      return (
        <InputList
          offset={1}
          answers={this.state.answers.step1}
          updateAnswers={this.saveAnswers('step1')}
          saveAndContinue={this.goForward}
          onCancel={this.handleRedirect}
        />
      );
    }
    if (step === 3) {
      return (
        <InputList
          offset={this.state.answers.step1.length + 1}
          answers={this.state.answers.step2}
          updateAnswers={this.saveAnswers('step2')}
          saveAndContinue={this.goForward}
          onCancel={this.handleRedirect}
        />
      );
    }
    if (step === 4) {
      return (
        <Confirm
          answers={[...this.state.answers.step1, ...this.state.answers.step2]}
          testWallet={this.testWallet}
          saveWallet={this.importWallet('mnemonic')}
          goBack={this.goBack}
        />
      );
    }
  };

  getPrivateKeyComponentForStep = () => {
    return (
      <PrivateKey
        onSubmit={this.importWallet('privateKey')}
        onCancel={this.handleRedirect}
      />
    );
  };

  getComponentForStep = step => {
    if (this.state.modalOpen) {
      return (
        <SuccessFailureScreen
          type={TYPE_SUCCESS}
          title={t('wallet.import_title_success')}
          mainButtonText={t('wallet.pin_button_text')}
          onPressMain={this.handleRedirect}
        />
      );
    }

    if (step === 0) {
      return (
        <SelectType
          onPressPrivateKey={this.selectRecoveryOption(false)}
          onPressMnemonicPhrase={this.selectRecoveryOption(true)}
          handleCancel={this.handleRedirect}
        />
      );
    }

    if (step === 1) {
      return <SelectCoin saveAndContinue={this.selectCoin} />;
    }

    if (this.state.isMnemonicPhrase) {
      return this.getMnemonicComponentForStep(step);
    } else {
      return this.getPrivateKeyComponentForStep(step);
    }
  };

  render() {
    const { step } = this.state;

    return (
      <View style={styles.container}>{this.getComponentForStep(step)}</View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
