import React, { Component } from "react";
import { StyleSheet, View, Image } from "react-native";
import PropTypes from "prop-types";
import createStyles, { dimensions, colors, padding, typography } from 'styles';

import Button from "components/Button";
import T from "components/Typography";

import { t } from 'translations/i18n';
export default class Type extends Component {
  static propTypes = {
    saveAndContinue: PropTypes.func.isRequired,
    newMnemonicType: PropTypes.string.isRequired,
    existingMnemonicType: PropTypes.string.isRequired,
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.bodyContainer}>
          <Image
            style={styles.image}
            source={require('assets/create-wallet-top.png')}
          />
          <T.Heading style={styles.heading}>
            {t('wallet.create_wallet_title')}
          </T.Heading>
          <T.Light style={styles.content}>
            {t('wallet.create_wallet_description')}
          </T.Light>
        </View>
        <View style={styles.buttonsContainer}>
          <Button
            style={styles.generateButton}
            onPress={this.props.saveAndContinue(this.props.newMnemonicType)}
          >
            {t('wallet.get_started')}
          </Button>
          <Button
            type="text"
            style={styles.recoverButton}
            onPress={this.props.saveAndContinue(this.props.existingMnemonicType)}
          >
            {t('wallet.existing_mnemonic')}
          </Button>
        </View>
      </View>
    );
  }
}

const imageWidth = dimensions.width * 0.40;
const imageHeight = imageWidth * 1.0989010989;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: padding.md,
    paddingBottom: padding.md,
  },
  image: {
    height: imageHeight,
    width: imageWidth,
    marginBottom: padding.xl,
    resizeMode: 'contain',
  },
  bodyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  heading: {
    color: colors.white,
    paddingBottom: padding.md,
    textAlign: 'center',
  },
  content: {
    fontFamily: "HelveticaNeue",
    fontSize: 16,
    fontWeight: "300",
    fontStyle: "normal",
    textAlign: "center",
    color: "#9da0a5"
  },
  buttonsContainer: {
    marginTop: 'auto'
  },
  generateButton: {
    marginBottom: padding.md,
  },
  recoverButton: {
  },
});
