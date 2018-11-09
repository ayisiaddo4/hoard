import React from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import Notification from './Notification';

export default function Notifications({
  children,
  notifications,
  notificationDismissed
}) {
  return (
    <View style={{flex: 1, backgroundColor: 'transparent'}}>
      {children}
      {notifications.length
       ? (
         <Notification
           notification={notifications[notifications.length - 1]}
           notificationDismissed={notificationDismissed}
         />
       )
        : null
      }
    </View>
  );
}

Notifications.propTypes = {
  children: PropTypes.node.isRequired,
  notifications: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    icon: PropTypes.any,
    onDismiss: PropTypes.func.isRequired,
    actions: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      onPress: PropTypes.func.isRequired,
    })).isRequired,
  })).isRequired,
  notificationDismissed: PropTypes.func.isRequired,
};
