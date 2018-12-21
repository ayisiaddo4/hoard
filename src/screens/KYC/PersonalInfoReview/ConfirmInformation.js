import React from 'react';
import PropTypes from 'prop-types';
import {
  ImageBackground,
  ScrollView,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import Input from 'components/Input';
import Button from 'components/Button';
import T from 'components/Typography';

export default class Verification extends React.Component {
  static navigationOptions = {
    header: null,
  };

  static propTypes = {
    cancelText: PropTypes.string.isRequired,
    confirmText: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })
    ),
    introText: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
  };

  static defaultProps = {
    introText:
      'Please verify the following information is correct. If there is an error, please contact us immediately.',
    cancelText: "Having trouble? Contact us and we'll help!",
    confirmText: 'Yes, this information is correct.',
  };

  render() {
    const {
      introText,
      cancelText,
      confirmText,
      fields,
      onCancel,
      onConfirm,
    } = this.props;

    return (
      <ImageBackground
        style={styles.imageView}
        imageStyle={styles.image}
        source={require('assets/BackgroundBlue.png')}
      >
        <ScrollView>
          <View style={styles.formContainer}>
            <T.Light style={styles.text}>{introText}</T.Light>
            <View style={styles.fieldsContainer}>
              {fields.map(({ label, value }) => (
                <View key={label} style={styles.returnedInputsContainer}>
                  <Text style={styles.inputLabel}>{label}</Text>
                  <Input
                    autoCapitalize="words"
                    placeholder={label}
                    value={value}
                    editable={false}
                    onChangeText={() => {}}
                    style={styles.input}
                  />
                </View>
              ))}
            </View>
            <Button onPress={onConfirm} style={styles.button} type="primary">
              {confirmText}
            </Button>
            <Button onPress={onCancel} type="text">
              <Text style={styles.supportButton}>{cancelText}</Text>
            </Button>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}
const styles = StyleSheet.create({
  fieldsContainer: {
    backgroundColor: 'transparent',
    flex: 1,
    marginTop: 20,
  },
  image: {
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  text: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    marginBottom: 10,
  },
  formContainer: {
    padding: 20,
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
  button: {
    marginTop: 20,
  },
  supportButton: {
    color: '#ffffff',
  },
  imageView: {
    flex: 1,
  },
});
