import { put, call, take, select } from 'redux-saga/effects';

import Storage from 'lib/storage';

import {
  UPDATE_TRADING_PAIR,
  UPDATE_ENABLE_BIOMETRICS,
  PROMPTED_ENABLE_BIOMETRICS,
  UPDATE_ENABLE_PUSH_NOTIFICATIONS,
  PROMPTED_ENABLE_PUSH_NOTIFICATIONS,
  SETTINGS_STORAGE_KEY,
} from './constants';

import CONFIG from 'src/config';

import { initializeSettings } from './actions';

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

  // Only prompt the user if we haven't prompted them yet
  // and we want to.
  if (state && !state.promptedEnablePushNotifications) {
    // TODO:
    // const result = yield call(enablePushNotifications, true);

    yield put({
      type: PROMPTED_ENABLE_PUSH_NOTIFICATIONS,
      promptedEnablePushNotifications: true,
      enablePushNotifications: false,
    });

    const settings = yield select(state => state.settings);
    yield Storage.set(SETTINGS_STORAGE_KEY, settings);
  }
}

export default function* settingsSagas() {
  yield take(INIT_REQUESTING);
  yield Storage.set(SETTINGS_STORAGE_KEY, null);

  // Add user's settings to redux or ask user for settings
  const state = yield Storage.get(SETTINGS_STORAGE_KEY);
  if (state) {
    yield put(initializeSettings(state));
  } else if (CONFIG.PROMPT_PUSH_NOTIFICATIONS_ON_STARTUP) {
    yield call(promptUserForSettings);
  }

  while (true) {
    yield take([
      // add other settings change events here
      UPDATE_TRADING_PAIR,
      UPDATE_ENABLE_BIOMETRICS,
      UPDATE_ENABLE_PUSH_NOTIFICATIONS,
    ]);

    const settings = yield select(state => state.settings);
    yield Storage.set(SETTINGS_STORAGE_KEY, settings);
  }
}
