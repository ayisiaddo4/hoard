import { UrbanAirship } from 'urbanairship-react-native';

// "Opted In" is the Urban Airship settings to send or not send messages

// // Methods on the user's device
// export const isPhonePushNotificationsEnabledOnDevice =
//   UrbanAirship.isUserNotificationsEnabled;
// export const enableUserPushNotificationsOnDevice =
//   UrbanAirship.enableUserPushNotifications;
//
// // Methods on the Push Notification Service End
// export const getChannelIdOnPushService = UrbanAirship.getChannelId;
// export const getRegistrationTokenOnPushService =
//   UrbanAirship.getRegistrationToken;
// export const isUserNotificationsOptedInOnPushService =
//   UrbanAirship.isUserNotificationsOptedIn;

// Methods on the user's device

const isPhonePushNotificationsEnabledOnDevice = () =>
  UrbanAirship.isUserNotificationsEnabled();
const enableUserPushNotificationsOnDevice = val =>
  UrbanAirship.enableUserPushNotifications(val);

const setUserNotificationsEnabledOnPushService = val =>
  UrbanAirship.setUserNotificationsEnabled(val);

const xenableUserPushNotificationsOnDevice = val => {
  console.log(
    'UA: notification-helpers.js: setting enableUserPushNotificationsOnDevice to ',
    val
  );
};

// Methods on the Push Notification Service End
const getChannelIdOnPushService = () => UrbanAirship.getChannelId();
const getRegistrationTokenOnPushService = () =>
  UrbanAirship.getRegistrationToken();
const isUserNotificationsOptedInOnPushService = () =>
  UrbanAirship.isUserNotificationsOptedIn();

export { isPhonePushNotificationsEnabledOnDevice };
export { enableUserPushNotificationsOnDevice };
export { getChannelIdOnPushService };
export { getRegistrationTokenOnPushService };
export { isUserNotificationsOptedInOnPushService };
export { setUserNotificationsEnabledOnPushService };
