import { createDrawerNavigator, createStackNavigator } from 'react-navigation';
import { Dimensions } from 'react-native';
import Wallet from 'screens/Wallet';
import Confirm from 'screens/Wallet/Confirm';
import KYC from 'screens/KYC';
import Settings from 'screens/Settings';
import About from 'screens/About';
import GetHelp from 'screens/GetHelp';
import Legal from 'screens/Legal';
import SendRequest from 'screens/SendRequest';
import RecipientSelection from 'screens/SendRequest/RecipientSelection';
import CoinInformation from 'screens/CoinInformation';
import TransactionStatus from 'screens/TransactionStatus';
import Authenticate from 'components/Authenticate';
import Store from 'components/Pin/Store';
import Menu from './Menu';
import { t } from 'translations/i18n';
import {
  cardStyle,
  transitionConfig,
  getNavigationOptions,
} from 'components/Base/Navigation';

const RouteConfigs = {
  Wallet: {
    screen: createStackNavigator(
      {
        Wallet: {
          screen: Wallet,
          navigationOptions: navProps =>
            getNavigationOptions({
              ...navProps,
              leftAction: false,
              title: t('menu.my_wallet'),
            }),
        },
        CoinInformation: {
          screen: CoinInformation,
          navigationOptions: navProps =>
            getNavigationOptions({
              ...navProps,
            }),
        },
        SendRequest: {
          screen: SendRequest,
          navigationOptions: navProps =>
            getNavigationOptions({
              ...navProps,
              leftAction: 'back',
              title: t('menu.transfer_funds'),
            }),
        },
        RecipientSelection: {
          screen: RecipientSelection,
          navigationOptions: navProps =>
            getNavigationOptions({
              ...navProps,
              leftAction: 'back',
              rightAction: null,
            }),
        },
        TransactionStatus: {
          screen: TransactionStatus,
          navigationOptions: navProps =>
            getNavigationOptions({
              ...navProps,
              leftAction: 'cancel',
            }),
        },
      },
      {
        headerMode: 'float',
        cardStyle,
        transitionConfig,
      }
    ),
  },
  Settings: {
    screen: Settings,
  },
  Confirm: {
    screen: Confirm,
  },
  KYC: {
    screen: KYC,
  },
  Authenticate: {
    screen: Authenticate,
  },
  Store: {
    screen: Store,
  },
  Legal: {
    screen: Legal,
  },
  About: {
    screen: About,
  },
  GetHelp: {
    screen: GetHelp,
  },
};

const drawerNavigatorConfig = {
  headerMode: 'float',
  drawerPosition: 'right',
  drawerWidth: Dimensions.get('window').width - 100,
  contentComponent: Menu,
};

export default createDrawerNavigator(RouteConfigs, drawerNavigatorConfig);
