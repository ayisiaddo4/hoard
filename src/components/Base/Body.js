import React from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  StyleSheet,
  View,
  ViewPropTypes,
  Platform,
} from 'react-native';

const Body = ({ style, children, navigationOffset, ...otherProps }) => {
  if (otherProps.scrollable) {
    const dismissKeyboard = otherProps.dismissKeyboard;
    const dismissMode = Platform.OS === 'ios' ? 'on-drag' : 'none';
    return (
      <View
        style={[
          styles.body,
          {
            marginTop: navigationOffset ? -navigationOffset : 0,
          },
        ]}
        {...otherProps}
      >
        <ScrollView
          contentOffset={{ x: 0, y: 0 }}
          bounces={otherProps.bounces}
          keyboardShouldPersistTaps={dismissKeyboard}
          keyboardDismissMode={dismissMode}
          contentContainerStyle={[
            style,
            {
              flexGrow: 1,
              paddingTop: navigationOffset ? navigationOffset : 0,
            },
          ]}
        >
          {children}
        </ScrollView>
      </View>
    );
  } else {
    return (
      <View style={[styles.body, style]} {...otherProps}>
        {children}
      </View>
    );
  }
};

Body.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  style: ViewPropTypes.style,
  navigationOffset: PropTypes.number,
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
});

export default Body;
