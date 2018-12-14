import { Platform } from 'react-native';
import { UrbanAirship } from 'urbanairship-react-native';
import DeviceInfo from 'react-native-device-info';
import { put, take, select, call, all } from 'redux-saga/effects';

import Storage from 'lib/storage';
var Reactotron = require('src/ReactotronConfig').default;

import {
  UPDATE_TRADING_PAIR,
  UPDATE_ENABLE_BIOMETRICS,
  PROMPTED_ENABLE_BIOMETRICS,
  UPDATE_ENABLE_PUSH_NOTIFICATIONS,
  SETTINGS_STORAGE_KEY,
} from './constants';

import CONFIG from 'src/config';

import { initializeSettings, updateDeviceInfo } from './actions';

import { INIT_REQUESTING } from 'containers/App/constants';
import { enableBiometrics } from 'screens/Settings/helpers';

function* promptUserForSettings() {
  const bench = Reactotron.benchmark('Prompting User for Settings');
  bench.step('Init..');

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
  bench.stop('Done');
}

export function* initialize() {
  const bench = Reactotron.benchmark('Initializing Settings');
  bench.step('Init..');

  // Code that does thing A bench.step("Thing A")
  // Add user's settings to redux or ask user for settings
  bench.step('Getting local storage...');
  const state = yield Storage.get(SETTINGS_STORAGE_KEY);
  bench.step('Getting local storage... Done');

  if (state) {
    bench.step('Initalize settings...');
    yield put(initializeSettings(state));
    bench.step('Initalize settings... Done');
  } else if (CONFIG.PROMPT_BIOMETRICS_ON_STARTUP) {
    bench.step('Prompt user for settings...');
    yield call(promptUserForSettings);
    bench.step('Prompt user for settings... Done');
  }

  if (!DeviceInfo.isEmulator()) {
    bench.step('Setting Urban Airship...');

    const channel = yield call(UrbanAirship.getChannelId);
    const device_type = Platform.OS;
    yield put(updateDeviceInfo({ channel, device_type }));
    yield call(UrbanAirship.setUserNotificationsEnabled, true);
    bench.step('Setting Urban Airship... Done');
  }

  bench.step('Initializing Settings... Done');
}

export function* saveState() {
  const bench = Reactotron.benchmark('Saving state');
  bench.step('Init..');

  const settings = yield select(state => state.settings);
  yield Storage.set(SETTINGS_STORAGE_KEY, settings);
  bench.stop(' Step');
}

export default function* settingsSagas() {
  yield take(INIT_REQUESTING);
  yield call(initialize);

  yield all([
    take(
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
