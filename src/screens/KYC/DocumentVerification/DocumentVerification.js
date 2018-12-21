import React from 'react';
import PropTypes from 'prop-types';
import {
  ImageBackground,
  Platform,
  ScrollView,
  View,
  StyleSheet,
  /* NativeModules,
   * NativeEventEmitter*/
} from 'react-native';

import Button from 'components/Button';
import T from 'components/Typography';
import NavigatorService from 'lib/navigator';

import { keyMapper } from 'lib/object-helpers';

/* const { JumioMobileSDKNetverify } = NativeModules;*/

/* const JumioArgs = [
 *   'JUMIO_API_KEY',
 *   'JUMIO_API_SECRET',
 *   'us',
 *   {
 *     requireVerification: true,
 *     customerId: 'CUSTOMERID',
 *     preselectedCountry: 'USA',
 *     cameraPosition: 'BACK',
 *     documentTypes: ['DRIVER_LICENSE', 'PASSPORT', 'IDENTITY_CARD', 'VISA']
 *   }
 * ];
 *
 * if (Platform.OS === 'ios') {
 *   JumioMobileSDKNetverify.initNetverifyWithCustomization(...JumioArgs, {
 *     backgroundColor: '#223252',
 *     tintColor: '#ffffff'
 *   });
 * } else {
 *   JumioMobileSDKNetverify.initNetverify(...JumioArgs);
 * }
 *
 * const emitterNetverify = new NativeEventEmitter(JumioMobileSDKNetverify);
 * */
/*
Jumio returns Netverify success response like:
{
  selectedCountry: USA,
  addressLine: 123 MAIN STREET,
  expiryDate: 20200101T00,
  postCode: 02255,
  city: BOSTON,
  scanReference: {UUID},
  idNumber: {ID},
  lastName: DOE,
  issuingCountry: USA,
  firstName: JOHN,
  dob: 19800101T00000000,
  issuingDate: 20150111T00000000,
  middleName: W,
  selectedDocumentType: DRIVER_LICENSE,
  subdivision: RI,
  extractionMethod: BARCODE,
  gender: m
}
*/

const SAMPLE_JUMIO_DATA = {
  selectedCountry: 'USA',
  addressLine: '123 MAIN STREET',
  expiryDate: '20200101T00',
  postCode: '02255',
  city: 'BOSTON',
  scanReference: '12345-12345-12345',
  idNumber: '12345',
  lastName: 'DOE',
  issuingCountry: 'USA',
  firstName: 'JOHN',
  dob: '19800101T00000000',
  issuingDate: '20150111T00000000',
  middleName: 'W',
  selectedDocumentType: 'DRIVER_LICENSE',
  subdivision: 'MA',
  extractionMethod: 'BARCODE',
  gender: 'm',
};

const JUMIO_TO_NORMALIZED_MAP = {
  addressLine: 'streetAddress',
  postCode: 'postal_code',
  idNumber: 'id_number',
  lastName: 'last_name',
  issuingCountry: 'country',
  firstName: 'first_name',
  dob: 'birthdate',
  middleName: 'middle_name',
  subdivision: 'state',
};

export default class Verification extends React.Component {
  static navigationOptions = {
    header: null,
  };

  static propTypes = {
    documentVerificationRequest: PropTypes.func.isRequired,
  };

  state = {
    documentScan: false,
  };

  componentDidMount() {
    /* emitterNetverify.addListener(
     *   'EventDocumentData',
     *   this.handleNetverifySuccess
     * );
     * emitterNetverify.addListener('EventError', EventError => {
     *   if (__DEV__) {
     *     //eslint-disable-next-line no-console
     *     console.log('EventError: ' + JSON.stringify(EventError));
     *   }
     * });*/
  }

  componentWillUnmount() {
    /* emitterNetverify.removeListener(
     *   'EventDocumentData',
     *   this.handleNetverifySuccess
     * );

     * emitterNetverify.removeListener('EventError', EventError => {
     *   if (__DEV__) {
     *     //eslint-disable-next-line no-console
     *     console.log('EventError: ' + JSON.stringify(EventError));
     *   }
     * });*/
  }

  handleNetverifySuccess = response => {
    // Take the data returned from Jumio and transform the keys to the kind we like
    const mappedKeys = keyMapper(response, JUMIO_TO_NORMALIZED_MAP);
    this.props.documentVerificationRequest(mappedKeys);
    NavigatorService.navigate('KYCStatus');
  };

  triggerJumio = () => {
    // TODO: remove this dev check
    if (__DEV__) {
      this.handleNetverifySuccess(SAMPLE_JUMIO_DATA);
    } else {
      /* JumioMobileSDKNetverify.startNetverify();*/
    }
  };

  render() {
    const LANG_HEADING_TEXT = "Let's Get Started!";
    const LANG_MAIN_TEXT =
      "In to participate in the Hoard ICO event, we'll need to verify your personal information.";

    return (
      <ImageBackground
        style={styles.imageView}
        imageStyle={styles.image}
        source={require('assets/BackgroundBlue.png')}
      >
        <ScrollView>
          <View style={styles.formContainer}>
            <View>
              <T.Heading style={styles.heading}>{LANG_HEADING_TEXT}</T.Heading>
              <T.Light style={styles.text}>{LANG_MAIN_TEXT}</T.Light>
              <T.Small style={styles.notification}>
                Please note, care about your privacy! Your personal information
                is never sent to or seen by us. This information is stored
                locally and is only transmitted once to our compliance
                authorization service.To learn more about these privacy
                policies, click here.
              </T.Small>
            </View>
            <Button
              onPress={this.triggerJumio}
              style={styles.button}
              type="primary"
            >
              Scan My Identification
            </Button>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}
const styles = StyleSheet.create({
  image: {
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  heading: {
    backgroundColor: 'transparent',
    color: '#ffffff',
  },
  text: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    marginBottom: 10,
  },
  notification: {
    backgroundColor: '#FDE3A7',
    color: '#F89406',
    fontStyle: 'italic',
    padding: 20,
    marginBottom: 20,
  },
  formContainer: {
    padding: 20,
  },
  button: {
    marginTop: 20,
  },
  imageView: {
    flex: 1,
  },
});
