import { put, take, takeEvery, select, call, all } from 'redux-saga/effects';

import Storage from 'lib/storage';

import {
  UPDATE_TRADING_PAIR,
  UPDATE_ENABLE_BIOMETRICS,
  UPDATE_DEVICE_INFO,
  PROMPTED_ENABLE_BIOMETRICS,
  UPDATE_ENABLE_PUSH_NOTIFICATIONS,
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
}

export function* initialize() {
  // Add user's settings to redux or ask user for settings
  const state = yield Storage.get(SETTINGS_STORAGE_KEY);
  if (state) {
    yield put(initializeSettings(state));
  } else if (CONFIG.PROMPT_BIOMETRICS_ON_STARTUP) {
    yield call(promptUserForSettings);
  }
}

export function* saveState() {
  const settings = yield select(state => state.settings);
  yield Storage.set(SETTINGS_STORAGE_KEY, settings);
}

export default function* settingsSagas() {
  yield take(INIT_REQUESTING);
  yield call(initialize);

  yield all([
    takeEvery(
      [
        // add other settings change events here
        UPDATE_TRADING_PAIR,
        UPDATE_ENABLE_BIOMETRICS,
        UPDATE_DEVICE_INFO,
        UPDATE_ENABLE_PUSH_NOTIFICATIONS,
      ],
      saveState
    ),
  ]);
}
