import { createStackNavigator } from 'react-navigation';
import {
  cardStyle,
  transitionConfig,
  getNavigationOptions,
} from 'components/Base/Navigation';
import { t } from 'translations/i18n';
import GetHelp from './GetHelp';
import CreateSupportTicket from './CreateSupportTicket';

const RoutingStack = createStackNavigator(
  {
    GetHelp: {
      screen: GetHelp,
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          leftAction: false,
          title: t('get_help.get_help.title'),
        }),
    },
    CreateSupportTicket: {
      screen: CreateSupportTicket,
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          title: t('get_help.submit_request.title'),
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
