import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  findNodeHandle,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Button from 'components/Button';
import T from 'components/Typography';
import Input from 'components/Input';
import memoize from 'lodash/memoize';
import { t } from 'translations/i18n';

import createStyles, {
  colors,
  gradients,
  typography,
  dimensions,
} from 'styles';
import LinearGradient from 'react-native-linear-gradient';
import { Layout, Body, Header, Footer } from 'components/Base';

const styles = createStyles();

const customStyles = createStyles({
  header: {
    fontSize: typography.size.lg,
    color: colors.pinkDark,
  },
  input: {
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  body: {
    paddingHorizontal: 20,
  },
  errorMessageContainer: {
    backgroundColor: '#ff6161',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    margin: 20,
  },
  errorMessage: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  title: {
    color: '#fff',
    marginTop: 10,
    fontSize: 40,
    fontWeight: '100',
    textAlign: 'center',
  },
  network: {
    color: '#fff',
    textAlign: 'center',
  },
  buttonContainerAlt: {
    marginVertical: 20,
  },
});

const styless = StyleSheet.create({
  body: {
    backgroundColor: 'red',
  },
});

const INPUTS = [
  { idd: 'First_Name' },
  { idd: 'Last_Name' },
  { idd: 'Email_Address' },
  { idd: 'Street_Address' },
  { idd: 'Best_Friend' },
  { idd: 'Favorite_Food' },
  { idd: 'Favorite_Animal' },
  { idd: 'Favorite_House' },
];

export default class StyleGuide extends Component {
  state = {
    inputText: '',
  };

  updateFormField = fieldName => text => {
    this.setState({ [fieldName]: text });
  };

  safeFocus = memoize(element => () => {
    this[element].current.focus();
  });

  handleOnFocus = () => {
    const currentlyFocusedField = TextInput.State.currentlyFocusedField();
    console.log('Focused: ', currentlyFocusedField);
    this.setState({ focusedInput: currentlyFocusedField });
  };

  render() {
    const INPUT_ELEMENTS = [];
    INPUTS.forEach((input, i) => {
      this[input.idd] = React.createRef();

      const nextInput = i < INPUTS.length - 1 ? INPUTS[i + 1].idd : input.idd;

      INPUT_ELEMENTS.push(
        <Input
          inputRef={this[input.idd]}
          testID={input.idd + '_test'}
          key={input.idd + 'key'}
          placeholder={input.idd}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          keyboardType="email-address"
          onSubmitEditing={this.safeFocus(nextInput)}
          onChangeText={this.updateFormField(input.idd)}
          value={this.state[input.idd] || ''}
          type="underline"
          blurOnSubmit={false}
          onFocus={this.handleOnFocus}
        />
      );
    });

    console.log(this);

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Layout keyboard focusedInput={this.state.focusedInput}>
          <Body
            scrollable
            style={styles.body}
            navigationOffset={80}
            dismissKeyboard={'handled'}
          >
            <Body
              style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: 'red',
              }}
            >
              {INPUT_ELEMENTS}
            </Body>
          </Body>
        </Layout>
      </TouchableWithoutFeedback>
    );
  }
}
