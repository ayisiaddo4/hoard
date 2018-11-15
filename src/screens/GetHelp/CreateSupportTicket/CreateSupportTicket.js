import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Config from 'react-native-config';
import { Alert, Keyboard, StyleSheet, View } from 'react-native';
import { Layout, Header, Body } from 'components/Base';
import { Try } from 'components/Conditional';
import { t } from 'translations/i18n';
import Input from 'components/Input';
import Button from 'components/Button';
import NavigatorService from 'lib/navigator';
import withDismissableKeyboard from 'hocs/withDismissableKeyboard';
import api from 'lib/api';

const DismissableView = withDismissableKeyboard(View);

export default class CreateSupportTicket extends Component {
  static propTypes = {
    isSignedIn: PropTypes.bool,
    emailAddress: PropTypes.string,
  };

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
    description: !description && t('get_help.submit_request.description_required'),
    name: !name && t('get_help.submit_request.name_required'),
  });

  submit = () => {
    Keyboard.dismiss();

    const { errors, answers } = this.state;
    if (errors.email_address || errors.subject || errors.description || errors.name) {
      return this.setState({ showErrors: true });
    }

    this.setState({
      loading: true
    }, async () => {
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
    });
  };

  render() {
    return (
      <Layout keyboard>
        <Body style={styles.content} dismissKeyboard scrollable>
          <DismissableView style={styles.container}>
            <Try condition={!this.props.isSignedIn}>
              <Input
                placeholder={t('get_help.submit_request.input_email')}
                keyboardType="email-address"
                returnKeyType="next"
                error={this.state.showErrors && this.state.errors.email_address}
                onChangeText={this.handleChange('email_address')}
                value={this.state.answers.email_address}
                type="underline"
              />
            </Try>
            <Input
              placeholder={t('get_help.submit_request.input_name')}
              returnKeyType="next"
              error={this.state.showErrors && this.state.errors.name}
              onChangeText={this.handleChange('name')}
              value={this.state.answers.name}
              type="underline"
            />
            <Input
              placeholder={t('get_help.submit_request.input_subject')}
              returnKeyType="next"
              error={this.state.showErrors && this.state.errors.subject}
              onChangeText={this.handleChange('subject')}
              value={this.state.answers.subject}
              type="underline"
            />
            <View onLayout={this.measureLargeInput} style={styles.largeInputContainer}>
              <Input
                placeholder={t('get_help.submit_request.input_description')}
                multiline={true}
                onChangeText={this.handleChange('description')}
                value={this.state.answers.description}
                error={this.state.showErrors && this.state.errors.description}
                style={[{ height: this.state.largeInputHeight }, styles.largeInput]}
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
    minHeight: 75
  },
  content: {
    padding: 20,
    paddingVertical: 40,
  },
});
