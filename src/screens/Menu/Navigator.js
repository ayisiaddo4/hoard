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
import withoutOffscreenRendering from 'hocs/withoutOffscreenRendering';

const RouteConfigs = {
  Wallet: {
    screen: createStackNavigator(
      {
        Wallet: {
          screen: withoutOffscreenRendering(Wallet),
          navigationOptions: navProps =>
            getNavigationOptions({
              ...navProps,
              leftAction: false,
              title: t('menu.my_wallet'),
            }),
        },
        CoinInformation: {
          screen: withoutOffscreenRendering(CoinInformation),
          navigationOptions: navProps =>
            getNavigationOptions({
              ...navProps,
            }),
        },
        SendRequest: {
          screen: withoutOffscreenRendering(SendRequest),
          navigationOptions: navProps =>
            getNavigationOptions({
              ...navProps,
              leftAction: 'back',
              title: t('menu.transfer_funds'),
            }),
        },
        RecipientSelection: {
          screen: withoutOffscreenRendering(RecipientSelection),
          navigationOptions: navProps =>
            getNavigationOptions({
              ...navProps,
              leftAction: 'back',
              rightAction: null,
            }),
        },
        TransactionStatus: {
          screen: withoutOffscreenRendering(TransactionStatus),
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
    screen: withoutOffscreenRendering(Settings),
  },
  Confirm: {
    screen: withoutOffscreenRendering(Confirm),
  },
  KYC: {
    screen: withoutOffscreenRendering(KYC),
  },
  Authenticate: {
    screen: withoutOffscreenRendering(Authenticate),
  },
  Store: {
    screen: withoutOffscreenRendering(Store),
  },
  Legal: {
    screen: withoutOffscreenRendering(Legal),
  },
  About: {
    screen: withoutOffscreenRendering(About),
  },
  GetHelp: {
    screen: withoutOffscreenRendering(GetHelp),
  },
};

const drawerNavigatorConfig = {
  headerMode: 'float',
  drawerPosition: 'right',
  drawerWidth: Dimensions.get('window').width - 100,
  contentComponent: Menu,
};

export default createDrawerNavigator(RouteConfigs, drawerNavigatorConfig);
