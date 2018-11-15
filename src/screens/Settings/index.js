import { createStackNavigator } from 'react-navigation';

import {
  cardStyle,
  transitionConfig,
  getNavigationOptions,
} from 'components/Base/Navigation';

import DisplayCurrency from './DisplayCurrency';
import SeedWords from './SeedWords';
import Settings from './Settings';
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
          rightAction: null
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
