import { createStackNavigator } from 'react-navigation';

import {
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

const RoutingStack = createStackNavigator(
  {
    Settings: {
      screen: Settings,
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          leftAction: false,
          title: t('settings.title'),
        }),
    },
    DisplayCurrency: {
      screen: DisplayCurrency,
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          title: null,
        }),
    },
    SeedWords: {
      screen: SeedWords,
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          leftAction: 'back',
          rightAction: null,
        }),
    },
    Security: {
      screen: Security,
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          leftAction: 'back',
          title: t('settings.security'),
          rightAction: null,
        }),
    },
    ChangePassword: {
      screen: ChangePassword,
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          leftAction: 'back',
          rightAction: null,
        }),
    },
    Profile: {
      screen: Profile,
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          leftAction: 'back',
          title: t('profile.title'),
          rightAction: null,
        }),
    },
    ManagePin: {
      screen: ManagePin,
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          leftAction: 'back',
          title: t('manage_pin.title'),
          rightAction: null,
        }),
    },
    UpdatePin: {
      screen: UpdatePin,
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
    cardStyle: {backgroundColor: 'transparent'},
    transparentCard: true,
    cardOverlayEnabled: true,
    cardShadowEnabled: false,
    transitionConfig,
  }
);

export default RoutingStack;
