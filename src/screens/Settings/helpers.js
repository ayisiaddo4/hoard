import TouchID from 'react-native-touch-id';
import { UrbanAirship } from 'urbanairship-react-native';

const androidConfigObject = {
  title: 'Authentication Required',
  color: '#E5129A',
};

export async function isBiometricsSupported() {
  let biometrics = {
    isSupported: false,
    type: 'Authentication',
  };

  try {
    let biometricsResponse = await TouchID.isSupported();

    if (biometricsResponse === 'FaceID') {
      biometrics.isSupported = true;
      biometrics.type = 'FaceID';
    } else {
      biometrics.isSupported = true;
      biometrics.type = 'TouchID';
    }
  } catch (e) {
    biometrics.error = (e && e.message) || 'Biometric support not available';
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('Biometrics Supported Error: ', e);
    }
  }
  return biometrics;
}

export async function enableBiometrics(bool) {
  if (!bool) {
    return false;
  }

  let authenticated = false;

  const supported = await isBiometricsSupported();

  if (!supported.isSupported) {
    return false;
  }

  try {
    let authenticateResponse = await TouchID.authenticate(
      'To unlock or authenticate Hoard',
      androidConfigObject
    );

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('authenticateResponse', authenticateResponse);
    }

    authenticated = true;
  } catch (e) {
    authenticated = false;
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('Biometrics Authentication Error: ', e);
    }
  }

  return authenticated;
}

export async function isPushNotificationsSupported() {
  let result = false;

  try {
    result = await UrbanAirship.isUserNotificationsOptedIn();
    // result = await UrbanAirship.isUserNotificationsEnabled();

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('Checking for push notification support: ', result);
    }
  } catch (e) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('Biometrics Supported Error: ', e);
    }
  }
  return result;
}

export async function enablePushNotifications(bool) {
  if (!bool) {
    return false;
  }

  let result = false;

  const supported = await isPushNotificationsSupported();

  if (!supported) {
    return false;
  }

  try {
    result = UrbanAirship.setUserNotificationsEnabled(bool);

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('Setting push notifications, response: ', result);
    }
  } catch (e) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('Setting push notifications Error: ', e);
    }
  }

  return result;
}
