import {
  UPDATE_TRADING_PAIR,
  UPDATE_ENABLE_PUSH_NOTIFICATIONS,
  UPDATE_DEVICE_INFO,
  UPDATE_ENABLE_BIOMETRICS,
  INITIALIZE_SETTINGS,
} from './constants';

export function initializeSettings(state) {
  return {
    type: INITIALIZE_SETTINGS,
    state,
  };
}

export function updateTradingPair(tradingPair) {
  return {
    type: UPDATE_TRADING_PAIR,
    tradingPair,
  };
}

export function updateEnablePushNotifications(enablePushNotifications) {
  return {
    type: UPDATE_ENABLE_PUSH_NOTIFICATIONS,
    enablePushNotifications,
  };
}

export function updateDeviceInfo(deviceInfo) {
  return {
    type: UPDATE_DEVICE_INFO,
    deviceInfo,
  };
}

export function updateEnableBiometrics(enableBiometrics) {
  return {
    type: UPDATE_ENABLE_BIOMETRICS,
    enableBiometrics,
  };
}
