import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ViewPropTypes,
} from 'react-native';
import T from 'components/Typography';
import LinearGradient from 'react-native-linear-gradient';
import { GradientText } from 'components/GradientText';
import { gradients, colors, calculateHitSlop } from 'styles';
const textHitSlop = calculateHitSlop(15, Infinity);

export default class Button extends PureComponent {
  static propTypes = {
    type: PropTypes.oneOf(['base', 'primary', 'secondary', 'text']),
    testID: PropTypes.string,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    style: ViewPropTypes.style,
    onPress: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node),
    ]).isRequired,
  };

  static defaultProps = {
    style: {},
    type: 'base',
  };

  render() {
    let hitSlop;
    const styles =
      stylesForType[
        this.props.disabled || this.props.loading
          ? `${this.props.type}Disabled`
          : this.props.type
      ];

    const shouldUpperCase = ['primary', 'text', 'secondary'].includes(
      this.props.type
    );

    let buttonContent;

    // Text Buttons
    if (typeof this.props.children === 'string' && this.props.type === 'text') {
      const buttonText = this.props.children;
      if (this.props.loading) {
        buttonContent = <ActivityIndicator size="small" />;
      } else {
        hitSlop = textHitSlop;
        buttonContent = (
          <T.ButtonText style={styles.buttonText}>
            {shouldUpperCase ? buttonText.toUpperCase() : buttonText}
          </T.ButtonText>
        );
      }
    }

    // Base Buttons
    else if (
      typeof this.props.children === 'string' &&
      this.props.type === 'base'
    ) {
      const buttonText = this.props.children;
      if (this.props.loading) {
        buttonContent = (
          <ActivityIndicator size="small" color={gradients.pink[0]} />
        );
      } else if (Platform.OS === 'ios') {
        buttonContent = (
          <GradientText style={styles.buttonText} gradient={gradients.pink}>
            {buttonText.toUpperCase()}
          </GradientText>
        );
      } else if (Platform.OS === 'android') {
        buttonContent = (
          <T.ButtonText style={[styles.buttonText, { color: colors.pinkDark }]}>
            {shouldUpperCase ? buttonText.toUpperCase() : buttonText}
          </T.ButtonText>
        );
      }
    }

    // Primary Buttons
    else if (this.props.type === 'primary') {
      const buttonText = this.props.children;
      buttonContent = (
        <LinearGradient
          start={gradients.horizontal.start}
          end={gradients.horizontal.end}
          colors={gradients.pink}
          style={[styles.buttonContainer, this.props.style]}
        >
          <TouchableOpacity
            disabled={this.props.disabled || this.props.loading}
            style={[this.props.style]}
            onPress={this.props.onPress}
          >
            {this.props.loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <T.ButtonText style={styles.buttonText}>
                {shouldUpperCase ? buttonText.toUpperCase() : buttonText}
              </T.ButtonText>
            )}
          </TouchableOpacity>
        </LinearGradient>
      );
      return buttonContent;
    }

    // Default Buttons
    else {
      buttonContent = this.props.children;
    }

    return (
      <TouchableOpacity
        testID={this.props.testID}
        hitSlop={hitSlop}
        disabled={this.props.disabled || this.props.loading}
        style={[styles.buttonContainer, this.props.style]}
        onPress={this.props.onPress}
      >
        {buttonContent}
      </TouchableOpacity>
    );
  }
}

const stylesForType = {
  text: StyleSheet.create({
    buttonContainer: {
      backgroundColor: 'transparent',
      paddingVertical: 0,
      overflow: 'hidden',
    },
    buttonText: {
      backgroundColor: 'transparent',
      textAlign: 'center',
      color: '#fff',
    },
  }),
  primary: StyleSheet.create({
    buttonContainer: {
      // backgroundColor: '#18AC63',
      borderRadius: 100,
      paddingVertical: 20,
      shadowColor: '#000',
      shadowOpacity: 0.5,
      shadowRadius: 4,
      shadowOffset: {
        width: 0,
        height: 1,
      },
    },
    buttonText: {
      backgroundColor: 'transparent',
      textAlign: 'center',
      color: '#FFF',
    },
  }),
  primaryDisabled: StyleSheet.create({
    buttonContainer: {
      backgroundColor: '#ffffff',
      opacity: 0.3,
      borderRadius: 100,
      paddingVertical: 20,
      shadowColor: '#000',
      shadowOpacity: 0.5,
      shadowRadius: 4,
      shadowOffset: {
        width: 0,
        height: 1,
      },
    },
    buttonText: {
      backgroundColor: 'transparent',
      textAlign: 'center',
      color: '#FFF',
    },
  }),
  secondary: StyleSheet.create({
    buttonContainer: {
      backgroundColor: '#FFF',
      borderRadius: 100,
      paddingVertical: 20,
      shadowColor: '#000',
      shadowOpacity: 0.5,
      shadowRadius: 4,
      shadowOffset: {
        width: 0,
        height: 1,
      },
    },
    buttonText: {
      backgroundColor: 'transparent',
      textAlign: 'center',
      color: '#000',
    },
  }),
  disabled: StyleSheet.create({
    buttonContainer: {
      opacity: 0.4,
    },
  }),
  base: StyleSheet.create({
    buttonContainer: {
      backgroundColor: '#fff',
      borderRadius: 100,
      paddingVertical: 20,
      shadowColor: '#000',
      shadowOpacity: 0.5,
      shadowRadius: 4,
      shadowOffset: {
        width: 0,
        height: 1,
      },
    },
    buttonText: {
      textAlign: 'center',
      color: '#223252',
      fontWeight: '700',
    },
  }),
  baseDisabled: StyleSheet.create({
    buttonContainer: {
      opacity: 0.5,
      backgroundColor: '#ffffff',
      borderRadius: 100,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#EEE',
      paddingVertical: 20,
    },
    buttonText: {
      backgroundColor: 'transparent',
      textAlign: 'center',
      color: '#EEE',
    },
  }),
  unstyled: {},
};
stylesForType.textDisabled = stylesForType.text;
