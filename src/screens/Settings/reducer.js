import {
  INITIALIZE_SETTINGS,
  TRADING_PAIR_USD,
  UPDATE_TRADING_PAIR,
  UPDATE_ENABLE_PUSH_NOTIFICATIONS,
} from './constants';

const initialState = {
  tradingPair: TRADING_PAIR_USD,
  enablePushNotifications: false,
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
    default:
      return state;
  }
}
