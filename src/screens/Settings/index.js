import { createStackNavigator } from 'react-navigation';

import {
  cardStyle,
  transitionConfig,
  getNavigationOptions,
} from 'components/Base/Navigation';

import DisplayCurrency from './DisplayCurrency';
import Profile from './Profile';
import Security from './Security';
import SeedWords from './SeedWords';
import ChangePassword from './ChangePassword';
import Settings from './Settings';
import ManagePin from './ManagePin';
import UpdatePin from './UpdatePin';
import { t } from 'translations/i18n';

import withoutOffscreenRendering from 'hocs/withoutOffscreenRendering';

const RoutingStack = createStackNavigator(
  {
    Settings: {
      screen: withoutOffscreenRendering(Settings),
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          leftAction: false,
          title: t('settings.title'),
        }),
    },
    DisplayCurrency: {
      screen: withoutOffscreenRendering(DisplayCurrency),
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          title: null,
        }),
    },
    SeedWords: {
      screen: withoutOffscreenRendering(SeedWords),
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          leftAction: 'back',
          rightAction: null,
        }),
    },
    Security: {
      screen: withoutOffscreenRendering(Security),
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          leftAction: 'back',
          title: t('settings.security'),
          rightAction: null,
        }),
    },
    ChangePassword: {
      screen: withoutOffscreenRendering(ChangePassword),
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          leftAction: 'back',
          rightAction: null,
        }),
    },
    Profile: {
      screen: withoutOffscreenRendering(Profile),
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          leftAction: 'back',
          title: t('profile.title'),
          rightAction: null,
        }),
    },
    ManagePin: {
      screen: withoutOffscreenRendering(ManagePin),
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          leftAction: 'back',
          title: t('manage_pin.title'),
          rightAction: null,
        }),
    },
    UpdatePin: {
      screen: withoutOffscreenRendering(UpdatePin),
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          leftAction: 'back',
          title: t('manage_pin.title'),
          rightAction: null,
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
