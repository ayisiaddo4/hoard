import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InteractionManager } from 'react-native';
import ProgressBar from 'components/ProgressBar';
import NavigatorService from 'lib/navigator';
import { t } from 'translations/i18n';

export default class LoadingScreen extends Component {
  static propTypes = {
    to: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(
        PropTypes.shape({
          routeName: PropTypes.string,
          params: PropTypes.object,
        })
      ),
    ]),
    appInitialized: PropTypes.bool.isRequired,
    walletHydrated: PropTypes.bool.isRequired,
    transactionsHydrated: PropTypes.bool.isRequired,
    pricingInitialized: PropTypes.bool.isRequired,
  };

  state = {
    interactionsFinished: false,
  };

  handleProgressCompletion = () => {
    const navigationMethod = Array.isArray(this.props.to)
      ? 'resetReplaceDeep'
      : 'resetReplace';
    NavigatorService[navigationMethod]('LoadingScreen', this.props.to);
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() =>
      this.setState({
        interactionsFinished: true,
      })
    );
  }

  render() {
    const {
      appInitialized,
      walletHydrated,
      transactionsHydrated,
      pricingInitialized,
    } = this.props;

    let descriptions = [];
    if (!appInitialized) {
      descriptions.push(t('loading.app_initialization'));
    }
    if (!transactionsHydrated) {
      descriptions.push(t('loading.transaction_hydration'));
    }
    if (!pricingInitialized) {
      descriptions.push(t('loading.price_initialization'));
    }
    if (!walletHydrated) {
      descriptions.push(t('loading.wallet_hydration'));
    }
    descriptions.push(t('loading.loading_finished'));

    const progress =
      (Number(appInitialized) +
        Number(walletHydrated) +
        Number(transactionsHydrated) +
        Number(pricingInitialized) +
        Number(this.state.interactionsFinished)) /
      5;

    return (
      <ProgressBar
        percentage={progress}
        description={descriptions[0]}
        onComplete={this.handleProgressCompletion}
      />
    );
  }
}
