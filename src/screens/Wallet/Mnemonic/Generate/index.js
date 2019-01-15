import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ethers } from 'ethers';

import Entropy from './Entropy';
import WordList from './WordList';
import Confirm from './Confirm';
import { t } from 'translations/i18n';
function getXItemsFromList(number, list) {
  let availableItems = list;
  const selectedItems = [];

  for (let i = 0; i < number; i++) {
    if (availableItems.length) {
      const selectedIndex = Math.floor(Math.random() * availableItems.length);
      const selectedItem = availableItems[selectedIndex];
      availableItems = [
        ...availableItems.slice(0, selectedIndex),
        ...availableItems.slice(selectedIndex + 1),
      ];
      selectedItems.push(selectedItem);
    } else {
      break;
    }
  }

  return selectedItems;
}

export default class Generate extends Component {
  static propTypes = {
    saveAndContinue: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  };

  state = {
    step: 1,
    mnemonic: ethers.Wallet.createRandom().mnemonic,
    confirmationList: [],
  };

  componentDidMount() {
    this.setNavigation();
  }

  setNavigation = () => {
    this.props.navigation.setParams({
      title: t('wallet.create_wallet_title'),
    });
  };

  generateNewMnemonic = extraEntropy => {
    this.setState(
      {
        mnemonic: ethers.Wallet.createRandom({ extraEntropy }).mnemonic,
      },
      this.nextStep
    );
  };

  generateConfirmationList = () => {
    const list = this.state.mnemonic.split(' ');
    const confirmationList = getXItemsFromList(2, list)
      .map(word => ({ i: list.indexOf(word), word }))
      .sort((a, b) => a.i - b.i);

    this.setState({ confirmationList }, this.nextStep);
  };

  nextStep = () => {
    const currentStep = this.state.step;
    const nextStep = currentStep <= 3 ? currentStep + 1 : 1;

    this.setState({
      step: nextStep,
    });
  };

  goBack = () => {
    const step = this.state.step - 1;

    if (step === 0) {
      this.props.goBack();
    }

    this.setState({ step });
  };

  saveNewWallet = () => this.props.saveAndContinue(this.state.mnemonic);

  render() {
    const { step, mnemonic } = this.state;
    if (step === 1) {
      return (
        <Entropy
          goBack={this.goBack}
          saveAndContinue={this.generateNewMnemonic}
          navigation={this.props.navigation}
        />
      );
    }
    if (step === 2) {
      if (__DEV__) {
        //eslint-disable-next-line no-console
        console.log('Generated List:', mnemonic.split(' '));
      }
      const mnemonicList = mnemonic.split(' ').slice(0, 6);
      return (
        <WordList
          key="a"
          offset={1}
          totalLength={12}
          list={mnemonicList}
          saveAndContinue={this.nextStep}
          goBack={this.goBack}
          navigation={this.props.navigation}
        />
      );
    }
    if (step === 3) {
      const mnemonicList = mnemonic.split(' ').slice(6, 12);

      return (
        <WordList
          key="b"
          offset={7}
          totalLength={12}
          list={mnemonicList}
          saveAndContinue={this.generateConfirmationList}
          goBack={this.goBack}
          navigation={this.props.navigation}
        />
      );
    }
    if (step === 4) {
      return (
        <Confirm
          list={this.state.confirmationList}
          saveWallet={this.saveNewWallet}
          goBack={this.goBack}
          navigation={this.props.navigation}
        />
      );
    }
  }
}
