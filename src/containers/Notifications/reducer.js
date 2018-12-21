import {
  NOTIFICATION_DISMISSED,
  NOTIFICATION_UPDATED,
  NOTIFICATION_RECIEVED,
} from './constants';

const initialState = [];

export default function(state = initialState, action) {
  switch (action.type) {
    case NOTIFICATION_RECIEVED: {
      return [...state, action.notification];
    }
    case NOTIFICATION_UPDATED: {
      const index = state.findIndex(
        notification => notification.uuid === action.notification.uuid
      );

      if (index === -1) {
        return state;
      }

      return [
        ...state.slice(0, index),
        action.notification,
        ...state.slice(index + 1),
      ];
    }
    case NOTIFICATION_DISMISSED: {
      const index = state.findIndex(
        notification => notification.uuid === action.notification.uuid
      );
      return [...state.slice(0, index), ...state.slice(index + 1)];
    }
    default:
      return state;
  }
}
