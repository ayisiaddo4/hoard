import { createStackNavigator } from 'react-navigation';

import {
  cardStyle,
  transitionConfig,
  getNavigationOptions,
} from 'components/Base/Navigation';

import Legal from './Legal';
import UserAgreement from './UserAgreement';
import Privacy from './Privacy';
import Compliance from './Compliance';

import withoutOffscreenRendering from 'hocs/withoutOffscreenRendering';

const RoutingStack = createStackNavigator(
  {
    Legal: {
      screen: withoutOffscreenRendering(Legal),
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          leftAction: false,
          title: 'Legal',
        }),
    },
    UserAgreement: {
      screen: withoutOffscreenRendering(UserAgreement),
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          title: 'Legal',
        }),
    },
    Privacy: {
      screen: withoutOffscreenRendering(Privacy),
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          title: 'Legal',
        }),
    },
    Compliance: {
      screen: withoutOffscreenRendering(Compliance),
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          title: 'Legal',
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
