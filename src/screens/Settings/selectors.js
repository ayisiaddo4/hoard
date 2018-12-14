import { createSelector } from 'reselect';

export const settingsSelector = state => state.settings;

export const deviceInfoSelector = createSelector(
  settingsSelector,
  settings => settings.deviceInfo
);

export const tradingPairSelector = createSelector(
  settingsSelector,
  settings => settings.tradingPair
);

export const enablePushNotificationsSelector = createSelector(
  settingsSelector,
  settings => settings.enablePushNotifications
);
