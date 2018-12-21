import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import SuccessFailureScreen, {
  TYPE_SUCCESS,
} from 'components/SuccessFailureScreen';
import Scene from 'components/Scene';
import { Layout } from 'components/Base';
import { t } from 'translations/i18n';
import Type from './Type';
import Recover from './Recover';
import Generate from './Generate';
import NavigatorService from 'lib/navigator';

const GENERATE = 'GENERATE';
const RECOVER = 'RECOVER';

export default class Mnemonic extends Component {
  static propTypes = {
    initializeMnemonic: PropTypes.func.isRequired,
    hasMnemonic: PropTypes.bool.isRequired,
  };

  state = {
    step: 1,
    type: null,
  };

  selectType = type => () => this.setState({ type, step: 2 });

  goBack = () => this.setState({ step: 1 });

  setMnemonic = mnemonic => this.props.initializeMnemonic(mnemonic);

  handleRedirect = () => {
    NavigatorService.navigate('Store');
  };

  getComponentForStep = step => {
    if (this.props.hasMnemonic) {
      return (
        <SuccessFailureScreen
          type={TYPE_SUCCESS}
          title={t('wallet.seed_title')}
          subtitle={t('wallet.seed_description')}
          mainButtonText={t('wallet.pin_button_text')}
          onPressMain={this.handleRedirect}
          navigation={this.props.navigation}
        />
      );
    }

    if (step === 1) {
      return (
        <Type
          newMnemonicType={GENERATE}
          existingMnemonicType={RECOVER}
          saveAndContinue={this.selectType}
          navigation={this.props.navigation}
        />
      );
    }

    if (step === 2) {
      if (this.state.type === GENERATE) {
        return (
          <Generate
            goBack={this.goBack}
            saveAndContinue={this.setMnemonic}
            navigation={this.props.navigation}
          />
        );
      }
      return (
        <Recover
          goBack={this.goBack}
          saveAndContinue={this.setMnemonic}
          navigation={this.props.navigation}
        />
      );
    }
  };

  render() {
    return (
      <Layout withHeader={false} preload={false}>
        <View style={styles.container}>
          {this.getComponentForStep(this.state.step)}
        </View>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
  },
});
