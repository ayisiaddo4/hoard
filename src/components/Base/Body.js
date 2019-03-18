import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  StyleSheet,
  View,
  ViewPropTypes,
  Platform,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { updateHeaderFromScroll } from 'components/Base/Navigation';

class Body extends Component {
  handleScroll = e => updateHeaderFromScroll(e, this.props.navigation);

  render() {
    const { style, children, navigationOffset, ...otherProps } = this.props;
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
            keyboardShouldPersistTaps={dismissKeyboard ? 'always' : 'handled'}
            keyboardDismissMode={dismissMode}
            onScroll={otherProps.onScroll || this.handleScroll}
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
  }
}

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

export default withNavigation(Body);
