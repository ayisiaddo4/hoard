import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  TextInput,
  Animated,
  ViewPropTypes,
} from 'react-native';
import { Try } from 'components/Conditional';

export default class Input extends Component {
  static propTypes = {
    autoCapitalize: PropTypes.oneOf([
      'none',
      'sentences',
      'words',
      'characters',
    ]),
    keyboardType: PropTypes.oneOf(['numeric', 'email-address', 'default']),
    returnKeyType: PropTypes.oneOf(['done', 'go', 'next', 'search', 'send']),
    light: PropTypes.bool,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    containerStyle: ViewPropTypes.style,
    style: TextInput.propTypes.style,
    value: PropTypes.string,
    onChangeText: PropTypes.func.isRequired,
    onSubmitEditing: PropTypes.func,
    onEndEditing: PropTypes.func,
    onBlur: PropTypes.func,
    editable: PropTypes.bool,
    secureTextEntry: PropTypes.bool,
  };

  static defaultProps = {
    placeholder: '',
    autoCapitalize: 'none',
    keyboardType: 'default',
    returnKeyType: 'done',
    editable: true,
    secureTextEntry: false,
    style: {},
    onSubmitEditing: () => false,
  };

  state = { active: false };

  inputRef = null;

  componentWillMount() {
    this._animatedIsActive = new Animated.Value(
      this.props.value === '' ? 0 : 1
    );
  }

  componentDidUpdate() {
    Animated.timing(this._animatedIsActive, {
      toValue: this.state.active || this.props.value !== '' ? 1 : 0,
      duration: 200,
    }).start();
  }

  setupInputRef = input => (this.inputRef = input);

  handleFocus = () =>
    this.setState({
      active: true,
    });

  handleBlur = () =>
    this.setState({
      active: false,
    });

  render() {
    const activeStyle = this.state.active
      ? this.props.light
        ? styles.input_active_light
        : styles.input_active
      : this.props.light
      ? styles.input_inactive_light
      : styles.input_inactive;

    const inputColors = this.props.light
      ? styles.input_light
      : styles.input_dark;

    const placeholderTextColor = this.props.light
      ? placeholderTextColorLight
      : placeholderTextColorDark;

    const { placeholder, ...filteredProps } = this.props; //eslint-disable-line no-unused-vars

    const { label } = this.props;
    const labelStyle = {
      position: 'absolute',
      fontSize: 14,
      left: 0,
      top: this._animatedIsActive.interpolate({
        inputRange: [0, 1],
        outputRange: [12, -20],
      }),
      color: this._animatedIsActive.interpolate({
        inputRange: [0, 1],
        outputRange: ['white', placeholderTextColor],
      }),
    };

    return (
      <View
        style={[styles.input_wrapper, this.props.containerStyle]}
        accessible={true}
        accessibilityLabel={label}
      >
        <Animated.Text style={labelStyle}>{label}</Animated.Text>
        <TextInput
          {...filteredProps}
          editable={this.props.editable}
          style={[styles.input, inputColors, activeStyle, this.props.style]}
          value={this.props.value}
          autoCapitalize={this.props.autoCapitalize}
          keyboardType={this.props.keyboardType}
          returnKeyType={this.props.returnKeyType}
          onChangeText={this.props.onChangeText}
          onSubmitEditing={this.props.onSubmitEditing}
          onEndEditing={this.props.onEndEditing}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          underlineColorAndroid="transparent"
          ref={this.setupInputRef}
          secureTextEntry={this.props.secureTextEntry}
        />
        <Try condition={this.props.actions}>
          <View style={styles.actionIcons}>{this.props.actions}</View>
        </Try>
      </View>
    );
  }
}

const placeholderTextColorDark = 'rgba(255,255,255,0.5)';
const placeholderTextColorLight = 'rgba(0,0,0,0.4)';

const styles = StyleSheet.create({
  actionIcons: {
    position: 'absolute',
    right: 0,
    padding: 10,
    flexDirection: 'row',
  },
  input_wrapper: {
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
  },
  input_dark: {
    color: '#fff',
  },
  input_active: {
    borderBottomColor: '#00c1ff',
    borderBottomWidth: 2.5,
    color: '#fff',
  },
  input_inactive: {
    borderBottomColor: 'rgba(255,255,255, 0.25)',
  },
  input_light: {
    color: '#000',
  },
  input_active_light: {
    borderBottomColor: 'rgba(0,0,0, 1)',
    color: '#000',
  },
  input_inactive_light: {
    borderBottomColor: 'rgba(0,0,0, 0.4)',
  },
});
