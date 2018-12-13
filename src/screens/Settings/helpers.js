import TouchID from 'react-native-touch-id';

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
