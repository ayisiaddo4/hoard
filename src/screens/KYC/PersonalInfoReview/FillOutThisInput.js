import React from 'react';
import PropTypes from 'prop-types';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Input from 'components/Input';
import Button from 'components/Button';
import withDismissableKeyboard from 'hocs/withDismissableKeyboard';

const DismissableView = withDismissableKeyboard(View);

export default class IsThisYou extends React.Component {
  static navigationOptions = {
    header: null,
  };

  static propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChangeText: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  render() {
    const { label, value, onChangeText, onSubmit } = this.props;

    const keyboardVerticalOffset = Platform.OS === 'ios' ? 60 : 0;

    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={styles.container}
      >
        <ImageBackground
          style={styles.imageView}
          imageStyle={styles.image}
          source={require('assets/BackgroundBlue.png')}
        >
          <DismissableView style={styles.returnedInputsContainer}>
            <Text style={styles.inputLabel}>{label}</Text>
            <Input
              autoCapitalize="words"
              placeholder={label}
              value={value}
              onChangeText={onChangeText}
              style={styles.input}
            />
            <Button type="primary" disabled={!value} onPress={onSubmit}>
              Looks good!
            </Button>
          </DismissableView>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  image: {
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  returnedInputsContainer: {
    marginTop: 20,
  },
  input: {
    marginBottom: 10,
  },
  inputLabel: {
    color: '#fff',
  },
  disabledInput: {},
  imageView: {
    flex: 1,
  },
});
