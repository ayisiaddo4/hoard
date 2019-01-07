import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Config from 'react-native-config';
import { Alert, Keyboard, StyleSheet, View, TextInput } from 'react-native';
import { Layout, Header, Body } from 'components/Base';
import { Try } from 'components/Conditional';
import { t } from 'translations/i18n';
import Input from 'components/Input';
import Button from 'components/Button';
import NavigatorService from 'lib/navigator';
import withDismissableKeyboard from 'hocs/withDismissableKeyboard';
import api from 'lib/api';
import memoize from 'lodash/memoize';

const DismissableView = withDismissableKeyboard(View);

export default class CreateSupportTicket extends Component {
  static propTypes = {
    isSignedIn: PropTypes.bool,
    emailAddress: PropTypes.string,
  };

  input_description = React.createRef();
  input_subject = React.createRef();
  input_name = React.createRef();
  input_email = React.createRef();

  state = {
    largeInputHeight: 40,
    loading: false,
    showErrors: false,
    answers: {
      email_address: '',
      name: '',
      subject: '',
      description: '',
    },
    errors: {
      email_address: false,
      name: false,
      subject: false,
      description: false,
    },
  };

  static getDerivedStateFromProps(props, state) {
    if (props.isSignedIn) {
      return {
        answers: {
          ...state.answers,
          email_address: props.emailAddress,
        },
      };
    }
    return null;
  }

  handleChange = type => value => {
    const answers = { ...this.state.answers, [type]: value };
    const errors = this.validate(answers);
    this.setState({ answers, errors });
  };

  measureLargeInput = ({ nativeEvent }) =>
    this.setState({ largeInputHeight: nativeEvent.layout.height - 80 });

  validate = ({ email_address, description, name }) => ({
    email_address:
      (!email_address && t('get_help.submit_request.email_required')) ||
      (!email_address.match(/^[a-zA-Z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$/) &&
        t('get_help.email_valid')),
    description:
      !description && t('get_help.submit_request.description_required'),
    name: !name && t('get_help.submit_request.name_required'),
  });

  safeFocus = memoize(element => () => {
    this[element].current.focus();
    const currentlyFocusedField = TextInput.State.currentlyFocusedField();
    this.setState({ focusedInput: currentlyFocusedField });
  });

  submit = () => {
    Keyboard.dismiss();

    const { errors, answers } = this.state;
    if (
      errors.email_address ||
      errors.subject ||
      errors.description ||
      errors.name
    ) {
      return this.setState({ showErrors: true });
    }

    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          const response = await api.post(
            `${Config.EREBOR_ENDPOINT}/support`,
            answers
          );
          if (response.success) {
            Alert.alert(
              t('get_help.submit_request.submit_success_title'),
              t('get_help.submit_request.submit_success_message'),
              [
                {
                  text: 'OK',
                  onPress: () => NavigatorService.navigate('GetHelp'),
                },
              ]
            );
          } else {
            throw new Error('Unknown Error');
          }
        } catch (e) {
          Alert.alert(
            t('get_help.submit_request.submit_error_title'),
            t('get_help.submit_request.submit_error_message'),
            [
              {
                text: 'OK',
                onPress: () => NavigatorService.navigate('GetHelp'),
              },
            ]
          );
        }
      }
    );
  };

  render() {
    return (
      <Layout keyboard focusedInput={this.state.focusedInput}>
        <Body style={styles.content} dismissKeyboard scrollable>
          <DismissableView style={styles.container}>
            <Try condition={!this.props.isSignedIn}>
              <Input
                inputRef={this.input_email}
                placeholder={t('get_help.submit_request.input_email')}
                keyboardType="email-address"
                returnKeyType="next"
                error={this.state.showErrors && this.state.errors.email_address}
                onChangeText={this.handleChange('email_address')}
                onSubmitEditing={this.safeFocus('input_name')}
                value={this.state.answers.email_address}
                type="underline"
                onFocus={this.safeFocus('input_email')}
                blurOnSubmit={false}
              />
            </Try>
            <Input
              inputRef={this.input_name}
              placeholder={t('get_help.submit_request.input_name')}
              returnKeyType="next"
              error={this.state.showErrors && this.state.errors.name}
              onChangeText={this.handleChange('name')}
              onSubmitEditing={this.safeFocus('input_subject')}
              value={this.state.answers.name}
              type="underline"
              onFocus={this.safeFocus('input_name')}
              blurOnSubmit={false}
            />
            <Input
              inputRef={this.input_subject}
              placeholder={t('get_help.submit_request.input_subject')}
              returnKeyType="next"
              error={this.state.showErrors && this.state.errors.subject}
              onChangeText={this.handleChange('subject')}
              onSubmitEditing={this.safeFocus('input_description')}
              value={this.state.answers.subject}
              type="underline"
              onFocus={this.safeFocus('input_subject')}
              blurOnSubmit={false}
            />
            <View
              onLayout={this.measureLargeInput}
              style={styles.largeInputContainer}
            >
              <Input
                inputRef={this.input_description}
                placeholder={t('get_help.submit_request.input_description')}
                multiline={true}
                onChangeText={this.handleChange('description')}
                value={this.state.answers.description}
                error={this.state.showErrors && this.state.errors.description}
                style={[
                  { height: this.state.largeInputHeight },
                  styles.largeInput,
                ]}
                onFocus={this.safeFocus('input_description')}
                blurOnSubmit={false}
              />
            </View>
            <Button
              disabled={
                !this.state.answers.email_address ||
                !this.state.answers.description ||
                !this.state.answers.name
              }
              loading={this.state.loading}
              onPress={this.submit}
            >
              {t('actions.submit')}
            </Button>
          </DismissableView>
        </Body>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  largeInputContainer: {
    flex: 1,
  },
  largeInput: {
    minHeight: 75,
  },
  content: {
    padding: 20,
    paddingVertical: 40,
  },
});
