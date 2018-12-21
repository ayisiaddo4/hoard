import React from 'react';
import PropTypes from 'prop-types';
import { Image, View, StyleSheet } from 'react-native';
import Button from 'components/Button';
import T from 'components/Typography';

export const TYPE_SUCCESS = 'success';
export const TYPE_FAILURE = 'failure';

const icon = {
  [TYPE_SUCCESS]: require('assets/success-circle.png'),
  [TYPE_FAILURE]: require('assets/error-circle.png'),
};

function SuccessFailureScreen({
  type,
  title,
  subtitle,
  mainButtonText,
  onPressMain,
  secondaryButtonText,
  onPressSecondary,
}) {
  let renderedTitle = title;
  if (!renderedTitle) {
    renderedTitle = type === TYPE_SUCCESS ? 'Success' : 'Failure';
  }

  return (
    <View style={styles.container}>
      <View style={styles.image}>
        <Image source={icon[type]} />
      </View>
      <View style={styles.content}>
        <T.Heading style={styles.heading}>{renderedTitle}</T.Heading>
        {subtitle && (
          <T.GrayedOut style={styles.subtitle}>{subtitle}</T.GrayedOut>
        )}
      </View>
      <View style={styles.buttons}>
        <Button style={styles.mainButton} onPress={onPressMain}>
          {mainButtonText}
        </Button>
        {secondaryButtonText && (
          <Button type="text" onPress={onPressSecondary}>
            <T.SemiBold style={styles.secondaryButton}>
              {secondaryButtonText}
            </T.SemiBold>
          </Button>
        )}
      </View>
    </View>
  );
}

SuccessFailureScreen.propTypes = {
  type: PropTypes.oneOf([TYPE_SUCCESS, TYPE_FAILURE]).isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  mainButtonText: PropTypes.string.isRequired,
  onPressMain: PropTypes.func.isRequired,
  secondaryButtonText: PropTypes.string,
  onPressSecondary: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    margin: 45,
    alignItems: 'center',
  },
  heading: {
    color: 'white',
  },
  subtitle: {
    color: 'white',
    opacity: 0.7,
  },
  buttons: {
    flex: 1,
    width: '100%',
  },
  mainButton: {},
  secondaryButton: {
    textAlign: 'center',
    color: 'white',
    marginTop: 30,
  },
});

export default SuccessFailureScreen;
