import { Platform } from 'react-native';
import { UrbanAirship } from 'urbanairship-react-native';
import DeviceInfo from 'react-native-device-info';
import { put, take, takeEvery, select, call, all } from 'redux-saga/effects';

import Storage from 'lib/storage';
import { isMatch } from 'lodash';
import {
  UPDATE_TRADING_PAIR,
  UPDATE_ENABLE_BIOMETRICS,
  PROMPTED_ENABLE_BIOMETRICS,
  UPDATE_ENABLE_PUSH_NOTIFICATIONS,
  SETTINGS_STORAGE_KEY,
} from './constants';

import CONFIG from 'src/config';

import {
  isPhonePushNotificationsEnabledOnDevice,
  enableUserPushNotificationsOnDevice,
  getChannelIdOnPushService,
  getRegistrationTokenOnPushService,
  isUserNotificationsOptedInOnPushService,
} from 'lib/notification-helpers';

import { initializeSettings, updateDeviceInfo } from './actions';

import { INIT_REQUESTING } from 'containers/App/constants';
import { enableBiometrics } from 'screens/Settings/helpers';

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

export function* initialize() {
  // Add user's settings to redux or ask user for settings
  const state = yield Storage.get(SETTINGS_STORAGE_KEY);

  const settings = yield select(state => state.settings);

  yield console.log(
    'UA: settings/sagas.js: 1 Initial state from local storage: ',
    state
  );
  yield console.log(
    'UA: settings/sagas.js: 2 Initial state from redux: ',
    settings
  );
  yield console.log(
    'UA: settings/sagas.js: 3 are asyncstorage and redux matching?',
    isMatch(settings, state)
  );

  if (state) {
    yield put(initializeSettings(state));
  } else if (CONFIG.PROMPT_BIOMETRICS_ON_STARTUP) {
    yield call(promptUserForSettings);
  }

  /// HERE ---->
}

export function* saveState() {
  const settings = yield select(state => state.settings);
  console.log('UA: settings/sagas.js: settings', settings);
  yield Storage.set(SETTINGS_STORAGE_KEY, settings);

  //
  const enabled = yield call(isPhonePushNotificationsEnabledOnDevice);
  const opted = yield call(isUserNotificationsOptedInOnPushService);
  console.log('UA: CHECKING isPhonePushNotificationsEnabledOnDevice:', enabled);
  console.log('UA: CHECKING isUserNotificationsOptedInOnPushService:', opted);
}

export default function* settingsSagas() {
  console.log('UA: Background 2');

  yield take(INIT_REQUESTING);
  yield call(initialize);

  yield all([
    takeEvery(
      [
        // add other settings change events here
        UPDATE_TRADING_PAIR,
        UPDATE_ENABLE_BIOMETRICS,
        UPDATE_ENABLE_PUSH_NOTIFICATIONS,
      ],
      saveState
    ),
  ]);
}
