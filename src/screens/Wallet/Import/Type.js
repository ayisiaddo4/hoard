import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";

import Button from "components/Button";
import T from "components/Typography";

import NavigatorService from "lib/navigator";

import { t } from 'translations/i18n';

export default class Step1 extends Component {
  static propTypes = {
    onPressPrivateKey: PropTypes.func.isRequired,
    onPressMnemonicPhrase: PropTypes.func.isRequired
  };

  handleCancel = () => {
    NavigatorService.navigate("Wallet");
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <T.Heading style={styles.headingStyle}>
            {t('wallet.recovery_title')}
          </T.Heading>
        </View>
        <View style={styles.bodyContainer}>
          <Button
            type="primary"
            style={styles.button}
            onPress={this.props.onPressPrivateKey}
          >
            {t('wallet.private_key')}
          </Button>
          <Button
            type="primary"
            style={styles.button}
            onPress={this.props.onPressMnemonicPhrase}
          >
            {t('wallet.mnemonic_phrase')}
          </Button>
        </View>
        <View style={styles.footerContainer}>
          <Button
            style={styles.cancelButton}
            type="text"
            onPress={this.handleCancel}
          >
            {t('actions.cancel')}
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#223252"
  },
  headingStyle: {
    color: "#ffffff"
  },
  bodyContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 0
  },
  button: {
    marginBottom: 20
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 10
  }
});
