import { put, take, select } from 'redux-saga/effects';

import Storage from 'lib/storage';

import {
  UPDATE_TRADING_PAIR,
  UPDATE_ENABLE_PUSH_NOTIFICATIONS,
  SETTINGS_STORAGE_KEY,
} from './constants';

import { initializeSettings } from './actions';

import { INIT_REQUESTING } from 'containers/App/constants';

export default function* settingsSagas() {
  yield take(INIT_REQUESTING);
  const state = yield Storage.get(SETTINGS_STORAGE_KEY);
  if (state) {
    yield put(initializeSettings(state));
  }

  while (true) {
    yield take([
      // add other settings change events here
      UPDATE_TRADING_PAIR,
      UPDATE_ENABLE_PUSH_NOTIFICATIONS,
    ]);
    const settings = yield select(state => state.settings);
    yield Storage.set(SETTINGS_STORAGE_KEY, settings);
  }
}
