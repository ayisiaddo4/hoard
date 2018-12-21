import uuid from 'uuid';

import {
  NOTIFICATION_DISMISSED,
  NOTIFICATION_UPDATED,
  NOTIFICATIONS_START_FLOW,
  NOTIFICATION_RECIEVED,
} from './constants';

export function startNotificationFlow({ flowType, type, ...otherDetails }) {
  return {
    type: NOTIFICATIONS_START_FLOW,
    flowType,
    ...otherDetails,
  };
}

export function notificationRecieved(notification) {
  return {
    type: NOTIFICATION_RECIEVED,
    notification: {
      ...notification,
      uuid: uuid(),
    },
  };
}

export function notificationUpdated(notification) {
  return {
    type: NOTIFICATION_UPDATED,
    notification,
  };
}

export function notificationDismissed(notification) {
  return {
    type: NOTIFICATION_DISMISSED,
    notification,
  };
}
