export const TRADING_PAIR_USD = 'USD';
export const TRADING_PAIR_AUD = 'AUD';
export const UPDATE_TRADING_PAIR = 'UPDATE_TRADING_PAIR';
export const UPDATE_ENABLE_PUSH_NOTIFICATIONS =
  'UPDATE_ENABLE_PUSH_NOTIFICATIONS';
export const UPDATE_DEVICE_INFO = 'UPDATE_DEVICE_INFO';
export const UPDATE_ENABLE_BIOMETRICS = 'UPDATE_ENABLE_BIOMETRICS';
export const PROMPTED_ENABLE_BIOMETRICS = 'PROMPTED_ENABLE_BIOMETRICS';
export const INITIALIZE_SETTINGS = 'INITIALIZE_SETTINGS';
export const SETTINGS_STORAGE_KEY = '@hoard:settings';

export const SUPPORTED_TRADING_PAIRS = [
  {
    name: TRADING_PAIR_USD,
    symbol: '$',
    image: require('assets/usd.png'),
  },
  {
    name: TRADING_PAIR_AUD,
    symbol: '$',
    image: require('assets/aud.png'),
  },
];
