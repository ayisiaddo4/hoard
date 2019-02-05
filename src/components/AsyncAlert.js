import { Alert } from 'react-native';

// Usage:
// await AsyncAlert( {...options} );

export const AsyncAlert = ({
  title,
  message,
  resolveText,
  rejectText,
  cancelable = false,
}) => {
  return new Promise(resolve => {
    Alert.alert(
      title || 'Title',
      message || 'Message',
      [
        {
          text: resolveText || 'YES',
          onPress: () => {
            resolve(true);
          },
        },
        {
          text: rejectText || 'NO',
          onPress: () => {
            resolve(false);
          },
        },
      ],
      { cancelable: cancelable }
    );
  });
};
