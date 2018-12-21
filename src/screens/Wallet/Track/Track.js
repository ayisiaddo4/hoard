import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import LoadingSpinner from 'components/LoadingSpinner';
import SelectCoin from '../components/SelectCoin';
import NavigatorService from 'lib/navigator';
import Modal from '../Modal';

import { t } from 'translations/i18n';
export default class Track extends Component {
  static propTypes = {
    availableCoins: PropTypes.arrayOf(PropTypes.string).isRequired,
    trackSymbol: PropTypes.func.isRequired,
    track_requesting: PropTypes.bool.isRequired,
    track_successful: PropTypes.bool.isRequired,
  };

  state = {
    coin: null,
  };

  selectCoin = coin => {
    this.setState({ coin }, () => this.props.trackSymbol(coin));
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

  handleRedirect = () => {
    NavigatorService.navigate('Wallet');
  };

  renderContent() {
    if (this.props.track_requesting) {
      return <LoadingSpinner />;
    }

    return (
      <SelectCoin
        coins={this.props.availableCoins}
        saveAndContinue={this.selectCoin}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderContent()}
        <Modal
          show={!!this.state.coin && this.props.track_successful}
          title={`${this.state.coin} ${t('wallet.track_added')}`}
          onCancel={this.handleRedirect}
          onDone={this.handleRedirect}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
