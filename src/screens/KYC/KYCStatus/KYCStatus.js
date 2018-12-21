import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ImageBackground, View } from 'react-native';

import Conditional, { Try, Otherwise } from 'components/Conditional';
import NavigatorService from 'lib/navigator';
import Button from 'components/Button';
import T from 'components/Typography';

export default class KYCStatus extends Component {
  static navigationOptions = {
    header: null,
  };

  static propTypes = {
    kyc: PropTypes.shape({
      requesting: PropTypes.bool.isRequired,
      authorized: PropTypes.oneOf([false, 'authorized', 'rejected']),
      successful: PropTypes.bool.isRequired,
      documentVerificationCompleted: PropTypes.bool.isRequired,
      infoVerificationCompleted: PropTypes.bool.isRequired,
      amlCompleted: PropTypes.bool.isRequired,
    }).isRequired,
  };

  renderButton = () => {
    const {
      requesting,
      successful,
      documentVerificationCompleted,
      infoVerificationCompleted,
      amlCompleted,
    } = this.props.kyc;

    let text, next;

    if (documentVerificationCompleted && !successful) {
      return null;
    }

    if (requesting) {
      return (
        <Button type="primary" disabled={true} onPress={() => {}}>
          Processing...
        </Button>
      );
    }

    if (!documentVerificationCompleted) {
      text = "Let's get started!";
      next = 'DocumentVerification';
    } else if (!infoVerificationCompleted) {
      text = 'Verify your information';
      next = 'PersonalInfoReview';
    } else if (!amlCompleted) {
      text = "Not sure what's supposed to happen now";
      next = 'KYCStatus';
    } else {
      text = 'TO THE MOON!';
      next = 'ICO';
    }

    return (
      <Button type="primary" onPress={() => NavigatorService.navigate(next)}>
        {text}
      </Button>
    );
  };

  getStatus(preconditionsPassed, itemCompleted, requesting) {
    if (!preconditionsPassed) return '';
    if (!itemCompleted) {
      if (requesting) return 'processing...';
      return 'TODO';
    }
    if (itemCompleted) return 'completed!';
  }

  render() {
    const {
      requesting,
      authorized,
      successful,
      documentVerificationCompleted,
      infoVerificationCompleted,
      amlCompleted,
    } = this.props.kyc;

    const documentVerificationStatus = this.getStatus(
      true,
      documentVerificationCompleted,
      requesting
    );

    const infoVerificationStatus = this.getStatus(
      documentVerificationCompleted,
      infoVerificationCompleted,
      requesting
    );

    const amlStatus = this.getStatus(
      documentVerificationCompleted && infoVerificationCompleted,
      amlCompleted,
      requesting
    );

    return (
      <ImageBackground
        style={styles.imageView}
        imageStyle={styles.image}
        source={require('assets/BackgroundBlue.png')}
      >
        <View style={styles.container}>
          <T.Heading style={styles.text}>Welcome to the ICO signup.</T.Heading>
          <T.SubHeading style={styles.text}>
            We’re going to need a few things:
          </T.SubHeading>
          <T.Light style={styles.text}>
            1. Scan your documentation {documentVerificationStatus}
          </T.Light>
          <Conditional>
            <Try condition={successful && authorized === 'rejected'}>
              <T.SubHeading style={[styles.error]}>
                We were unable to verify your documentation. Please contact
                support.
              </T.SubHeading>
            </Try>
            <Otherwise>
              <View>
                <T.Light style={styles.text}>
                  1. Verify who you are {infoVerificationStatus}
                </T.Light>
                <T.Light style={styles.text}>
                  2. Make sure you’re able to invest safely {amlStatus}.
                </T.Light>
                <T.Light style={styles.text}>3. ... </T.Light>
                <T.Light style={styles.text}>4. Success! </T.Light>
                {this.renderButton()}
              </View>
            </Otherwise>
          </Conditional>
          <Button type="text" onPress={() => NavigatorService.navigate('Menu')}>
            Nah, not right now.
          </Button>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    height: 100,
    padding: 20,
  },
  image: {
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  imageView: {
    flex: 1,
  },
  error: {
    color: 'red',
  },
  text: {
    color: 'white',
    marginBottom: 10,
  },
});
