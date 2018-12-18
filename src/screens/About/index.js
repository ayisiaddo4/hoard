import { createStackNavigator } from 'react-navigation';

import About from './About';
import OpenSource from './OpenSource';
import ReleaseNotes from './ReleaseNotes';

import {
  cardStyle,
  transitionConfig,
  getNavigationOptions,
} from 'components/Base/Navigation';
import withoutOffscreenRendering from 'hocs/withoutOffscreenRendering';

const RoutingStack = createStackNavigator(
  {
    About: {
      screen: withoutOffscreenRendering(About),
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          leftAction: false,
          title: 'About',
        }),
    },
    OpenSource: {
      screen: withoutOffscreenRendering(OpenSource),
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          leftAction: 'back',
          title: 'Open Source Thanks',
        }),
    },
    ReleaseNotes: {
      screen: withoutOffscreenRendering(ReleaseNotes),
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
    cardStyle,
    transitionConfig,
  }
);

export default RoutingStack;
