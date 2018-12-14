import {
  INITIALIZE_SETTINGS,
  TRADING_PAIR_USD,
  UPDATE_TRADING_PAIR,
  UPDATE_ENABLE_PUSH_NOTIFICATIONS,
  UPDATE_DEVICE_INFO,
  UPDATE_ENABLE_BIOMETRICS,
  PROMPTED_ENABLE_BIOMETRICS,
} from './constants';

const initialState = {
  tradingPair: TRADING_PAIR_USD,
  enablePushNotifications: false,
  deviceInfo: null,
  enableBiometrics: false,
  promptedEnableBiometrics: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case INITIALIZE_SETTINGS:
      return {
        ...state,
        ...action.state,
      };
    case UPDATE_TRADING_PAIR:
      return {
        ...state,
        tradingPair: action.tradingPair,
      };
    case UPDATE_ENABLE_PUSH_NOTIFICATIONS:
      return {
        ...state,
        enablePushNotifications: action.enablePushNotifications,
      };
    case UPDATE_DEVICE_INFO:
      return {
        ...state,
        deviceInfo: action.deviceInfo,
      };
    case UPDATE_ENABLE_BIOMETRICS:
      return {
        ...state,
        enableBiometrics: action.enableBiometrics,
      };
    case PROMPTED_ENABLE_BIOMETRICS:
      return {
        ...state,
        promptedEnableBiometrics: action.promptedEnableBiometrics,
        enableBiometrics: action.enableBiometrics,
      };
    default:
      return state;
  }
}
