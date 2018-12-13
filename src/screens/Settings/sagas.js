import { put, call, take, select } from 'redux-saga/effects';

import Storage from 'lib/storage';
import TouchID from 'react-native-touch-id';

import {
  UPDATE_TRADING_PAIR,
  UPDATE_ENABLE_BIOMETRICS,
  PROMPTED_ENABLE_BIOMETRICS,
  UPDATE_ENABLE_PUSH_NOTIFICATIONS,
  SETTINGS_STORAGE_KEY,
} from './constants';

import CONFIG from 'src/config';

import { initializeSettings } from './actions';

import { INIT_REQUESTING } from 'containers/App/constants';

const androidConfigObject = {
  title: 'Authentication Required',
  color: '#e00606',
};

export async function isBiometricsSupported() {
  let biometrics = {
    isSupported: false,
    isEnabled: false,
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

function* promptUserForSettings() {
  const state = yield select(state => state.settings);

  // Only prompt the user if we haven't prompted them yet
  // and we want to.
  if (state && !state.promptedEnableBiometrics) {
    const result = yield call(enableBiometrics, true);

    yield put({
      type: PROMPTED_ENABLE_BIOMETRICS,
      promptedEnableBiometrics: true,
      enableBiometrics: result,
    });

    const settings = yield select(state => state.settings);
    yield Storage.set(SETTINGS_STORAGE_KEY, settings);
  }
}

export default function* settingsSagas() {
  yield take(INIT_REQUESTING);

  // Add user's settings to redux or ask user for settings
  const state = yield Storage.get(SETTINGS_STORAGE_KEY);
  if (state) {
    yield put(initializeSettings(state));
  } else if (CONFIG.PROMPT_BIOMETRICS_ON_STARTUP) {
    yield call(promptUserForSettings);
  }

  while (true) {
    const action = yield take([
      // add other settings change events here
      UPDATE_TRADING_PAIR,
      UPDATE_ENABLE_BIOMETRICS,
      UPDATE_ENABLE_PUSH_NOTIFICATIONS,
    ]);

    if (action.type == UPDATE_ENABLE_BIOMETRICS) {
      const result = yield call(enableBiometrics, action.enableBiometrics);
      yield put({
        type: UPDATE_ENABLE_BIOMETRICS,
        enableBiometrics: result,
      });
    }

    const settings = yield select(state => state.settings);
    yield Storage.set(SETTINGS_STORAGE_KEY, settings);
  }
}
