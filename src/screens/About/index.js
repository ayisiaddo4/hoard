import { createStackNavigator } from 'react-navigation';

import About from './About';
import OpenSource from './OpenSource';
import ReleaseNotes from './ReleaseNotes';

import {
  transitionConfig,
  getNavigationOptions,
} from 'components/Base/Navigation';

import { colors } from 'styles';

const RoutingStack = createStackNavigator(
  {
    About: {
      screen: About,
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          leftAction: false,
          title: 'About',
        }),
    },
    OpenSource: {
      screen: OpenSource,
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          leftAction: 'back',
          title: 'Open Source Thanks',
        }),
    },
    ReleaseNotes: {
      screen: ReleaseNotes,
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          leftAction: 'back',
          title: 'Release Notes',
        }),
    },
  },
  {
    headerMode: 'float',
    cardStyle: { backgroundColor: colors.background },
    cardShadowEnabled: false,
    transitionConfig,
  }
);

export default RoutingStack;
