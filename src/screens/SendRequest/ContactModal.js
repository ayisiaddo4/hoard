import React, { Component, Fragment } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import Contact from './Contact';
import Contacts from 'react-native-contacts';
import Button from 'components/Button';
import Conditional, { Try, Otherwise } from 'components/Conditional';
import Icon from 'components/Icon';
import Input from 'components/Input';
import LinearGradient from 'react-native-linear-gradient';
import LoadingSpinner from 'components/LoadingSpinner';
import Modal from 'components/Modal';
import T from 'components/Typography';
import { t } from 'translations/i18n';

import NavigatorService from 'lib/navigator';
import memoize from 'lodash/memoize';
import throttle from 'lodash/throttle';
import { createFilter } from 'react-native-search-filter';
import {
  RECIPIENT_TYPE_OTHER,
  TYPE_SEND,
  TYPE_REQUEST,
} from 'screens/SendRequest/constants';

import { gradients } from 'styles';

const FILTER_BY_KEYS = [
  'givenName',
  'middleName',
  'familyName',
  'emailAddress',
  'phoneNumber',
];

export default class ContactModal extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          onChangeRecipient: PropTypes.func.isRequired,
          transactionType: PropTypes.oneOf([TYPE_REQUEST, TYPE_SEND]),
        }),
      }),
    }),
  };

  state = {
    contacts: null,
    shownContacts: null,
    permission: Contacts.PERMISSION_UNDEFINED,
    value: '',
  };

  async componentDidMount() {
    let permission = await this.checkPermission();

    if (permission === Contacts.PERMISSION_UNDEFINED) {
      permission = await this.requestPermission();
    }

    this.setState({ permission }, async () => {
      if (permission === Contacts.PERMISSION_AUTHORIZED) {
        const contacts = await this.fetchContacts();
        this.setState({
          contacts,
          shownContacts: this.filterContacts(contacts, this.state.value),
        });
      }
    });
  }

  checkPermission = async () => {
    if (Platform.OS == 'android') {
      const permission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS
      );
      return permission
        ? Contacts.PERMISSION_AUTHORIZED
        : Contacts.PERMISSION_DENIED;
    } else if (Platform.OS === 'ios') {
      const permission = await new Promise((resolve, reject) => {
        Contacts.checkPermission((err, resp) => {
          if (err) {
            reject(err);
          } else {
            resolve(resp);
          }
        });
      });
      return permission;
    }
  };

  requestPermission = async () => {
    if (Platform.OS == 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: t('send_request.modal.contacts_title'),
          message: t('send_request.modal.contacts_message'),
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return Contacts.PERMISSION_AUTHORIZED;
      } else {
        return Contacts.PERMISSION_DENIED;
      }
    } else if (Platform.OS === 'ios') {
      const permission = await new Promise((resolve, reject) => {
        Contacts.requestPermission((err, resp) => {
          if (err) {
            reject(err);
          } else {
            resolve(resp);
          }
        });
      });
      return permission;
    }
  };

  fetchContacts = () =>
    new Promise((resolve, reject) => {
      Contacts.getAll((err, resp) => {
        if (err) {
          reject(err);
        } else {
          const contacts = resp.map(contact => ({
            ...contact,
            emailAddress:
              contact.emailAddresses[0] && contact.emailAddresses[0].email,
            phoneNumber:
              contact.phoneNumbers[0] && contact.phoneNumbers[0].number,
          }));
          resolve(contacts);
        }
      });
    });

  filterContacts = throttle((contacts, filterString) => {
    if (!filterString || !contacts || !contacts.filter) {
      return contacts;
    }

    return contacts.filter(createFilter(filterString, FILTER_BY_KEYS));
  });

  changeText = value =>
    this.setState({ value }, () =>
      this.setState({
        shownContacts: this.filterContacts(this.state.contacts, value),
      })
    );

  handleConnectContacts = async () => {
    let { permission, value } = this.state;

    if (
      permission === Contacts.PERMISSION_UNDEFINED ||
      (Platform.OS === 'android' && permission === Contacts.PERMISSION_DENIED)
    ) {
      permission = await this.requestPermission();
      this.setState({ permission }, async () => {
        if (permission === Contacts.PERMISSION_AUTHORIZED) {
          const contacts = await this.fetchContacts();
          this.setState({
            contacts,
            shownContacts: this.filterContacts(contacts, value),
          });
        }
      });
    } else {
      Alert.alert(
        t('device.permission_denied_title'),
        t('device.permission_denied_message'),
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Go To Settings',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              }
            },
          },
        ]
      );
    }
  };

  handleSubmit = () => {
    this.props.navigation.state.params.onChangeRecipient({
      recipientType: RECIPIENT_TYPE_OTHER,
      recipient: this.state.value,
    });
    NavigatorService.navigate('SendRequest');
  };

  handleSelectContact = memoize(contact => () => {
    this.props.navigation.state.params.onChangeRecipient({
      recipientType: RECIPIENT_TYPE_OTHER,
      recipient: contact,
    });
    NavigatorService.navigate('SendRequest');
  });

  keyExtractor = contact => contact.recordID;

  renderContactRow = ({ item: contact }) => (
    <Contact
      key={contact.recordID}
      style={styles.contact}
      contact={contact}
      onPress={this.handleSelectContact(contact)}
    />
  );

  render() {
    const { permission, value, contacts, shownContacts } = this.state;

    let inputPlaceholder = t('send_request.modals.input_contact');
    if (this.props.navigation.state.params.transactionType === TYPE_SEND) {
      inputPlaceholder = t('send_request.modals.input_send_to');
    }
    if (this.props.navigation.state.params.transactionType === TYPE_REQUEST) {
      inputPlaceholder = t('send_request.modals.input_request_from');
    }

    const clearButton = (
      <TouchableOpacity style={styles.action} onPress={this.clear}>
        <Icon
          icon="ios-close-circle"
          style={{ size: 20, color: 'rgba(255,255,255,0.5)' }}
        />
      </TouchableOpacity>
    );

    return (
      <Modal
        title="Contact"
        footer={
          <Button style={styles.nextButton} onPress={this.handleSubmit}>
            {t('actions.next')}
          </Button>
        }
      >
        <T.Light style={styles.subtitle}>
          {t('send_request.modals.contacts_subtitle')}
        </T.Light>
        <Input
          type="underline"
          placeholder={inputPlaceholder}
          onChangeText={this.changeText}
          value={value}
          actions={clearButton}
        />
        <Conditional>
          <Try
            condition={
              permission === Contacts.PERMISSION_AUTHORIZED && !contacts
            }
          >
            <LoadingSpinner />
          </Try>
          <Try
            condition={
              permission === Contacts.PERMISSION_AUTHORIZED &&
              !!shownContacts &&
              !shownContacts.length
            }
          >
            <T.Light style={styles.content}>
              {t('send_request.modals.contacts_message_none')}
            </T.Light>
          </Try>
          <Try
            condition={
              permission === Contacts.PERMISSION_AUTHORIZED &&
              !!shownContacts &&
              !!shownContacts.length
            }
          >
            <Fragment>
              <T.SubHeading style={styles.contactsHeader}>
                {t('send_request.modals.contacts_title')}
              </T.SubHeading>
              <FlatList
                data={shownContacts}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderContactRow}
              />
              <LinearGradient
                end={gradients.vertical.start}
                start={gradients.vertical.end}
                colors={gradients.transparentBlueGray}
                style={styles.bottomFade}
              />
            </Fragment>
          </Try>
          <Otherwise>
            <View style={styles.infoContainer}>
              <Image
                style={styles.infoIcon}
                source={require('assets/information-icon.png')}
              />
              <View>
                <T.Light style={styles.content}>
                  {t('send_request.modals.contacts_not_synced')}
                </T.Light>
                <TouchableOpacity onPress={this.handleConnectContacts}>
                  <T.Light style={styles.cta}>
                    {t('send_request.modals.contacts_connect')}
                  </T.Light>
                </TouchableOpacity>
              </View>
            </View>
          </Otherwise>
        </Conditional>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  nextButton: {
    borderRadius: 0,
    marginHorizontal: -20,
    marginBottom: -40,
  },
  subtitle: {
    color: 'white',
    marginBottom: 0,
  },
  contactsHeader: {
    color: 'white',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  contact: {
    marginVertical: 7.5,
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  infoIcon: {
    height: 19,
    width: 19,
    resizeMode: 'contain',
  },
  content: {
    fontFamily: 'HelveticaNeue-Light',
    fontWeight: '300',
    textAlign: 'center',
    color: 'white',
    margin: 5,
  },
  bottomFade: {
    position: 'absolute',
    height: 40,
    left: 20,
    width: '100%',
    bottom: 0,
  },
  cta: {
    fontFamily: 'HelveticaNeue-Bold',
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    margin: 5,
  },
});
