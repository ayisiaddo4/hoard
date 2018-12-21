import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { getColors, colors } from 'styles';
import NavigatorService from 'lib/navigator';
import Icon from 'components/Icon';
import T from 'components/Typography';

const headerStyles = {
  fontFamily: 'HelveticaNeue',
  fontSize: 17,
  fontWeight: '200',
  letterSpacing: 2,
  textAlign: 'center',
  color: 'rgb(124, 138, 154)',
};

export default function withHeader(title, WrappedComponent) {
  return class Wrapper extends React.Component {
    static displayName = `withHeader(${title})`;
    static navigationOptions = () => ({
      drawerLabel: ({ focused }) => (
        <Text
          style={{
            color: focused
              ? getColors().interactivePrimaryText
              : getColors().textPrimary,
            backgroundColor: focused
              ? getColors().interactivePrimary
              : getColors().background,
            padding: 20,
            textAlign: 'center',
            width: '100%',
          }}
        >
          {title}
        </Text>
      ),
      headerTitle: (
        <T.Heading style={headerStyles}>{title.toUpperCase()}</T.Heading>
      ),
      headerTintColor: colors.gray,
      headerStyle: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        borderBottomWidth: 0,
      },
      headerRight: (
        <TouchableOpacity
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}
          onPress={NavigatorService.openDrawer}
        >
          <Icon icon="ios-menu-outline" style={{ size: 25 }} />
        </TouchableOpacity>
      ),
    });

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
