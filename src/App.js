import React from 'react';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import { UrbanAirship } from 'urbanairship-react-native';
import {
  Alert,
  AppRegistry,
  Button,
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  ListView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import NavigatorService from 'lib/navigator';
import configureStore from './configureStore';
import { StyleSheet, YellowBox } from 'react-native';

/* import HockeyApp from 'react-native-hockeyapp';*/
// import Config from 'react-native-config';
import Login from 'screens/Login';
import Mnemonic from 'screens/Wallet/Mnemonic';
import Track from 'screens/Wallet/Track';
import Import from 'screens/Wallet/Import';
import Signup from 'screens/Signup';
import Forgot from 'screens/Forgot';
import LoadingScreen from 'screens/LoadingScreen';
import ForgotModal from 'screens/Forgot/ForgotModal';
import Menu from 'screens/Menu';
import ViewAddress from 'screens/ViewAddress';
import AddressModal from 'screens/SendRequest/AddressModal';
import QRModal from 'screens/SendRequest/QRModal';
import ContactModal from 'screens/SendRequest/ContactModal';
import CurrencyModal from 'screens/SendRequest/CurrencyModal';
import Notifications from 'containers/Notifications';
import { createStackNavigator } from 'react-navigation';
import { INIT_REQUESTING } from './containers/App/constants';
import { gradients } from 'styles';
import LinearGradient from 'react-native-linear-gradient';

import {
  cardStyle,
  transitionConfig,
  getNavigationOptions,
} from 'components/Base/Navigation';

export const store = configureStore();
export let navigatorRef;

const RoutingStack = createStackNavigator(
  {
    LoadingScreen: { screen: LoadingScreen, navigationOptions: { header: null } },
    Login: {
      screen: Login,
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          leftAction: null,
          rightAction: null,
        }),
    },
    Signup: {
      screen: Signup,
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          leftAction: 'back',
          rightAction: null,
        }),
    },
    Forgot: {
      screen: Forgot,
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          rightAction: null,
        }),

     },
    Menu: { screen: Menu, navigationOptions: { header: null } },
    Mnemonic: {
      screen: Mnemonic,
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
          leftAction: false,
          rightAction: false,
        }),
    },
    Track: {
      screen: Track,
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
        }),
    },
    Import: {
      screen: Import,
      navigationOptions: navProps =>
        getNavigationOptions({
          ...navProps,
        }),
    },
  },
  {
    headerMode: 'float',
    navigationOptions: {
      headerStyle: {
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
      },
    },
    cardStyle,
    transitionConfig,
  }
);

const ModalStack = createStackNavigator(
  {
    Main: { screen: RoutingStack },
    ForgotModal: {
      screen: ForgotModal,
    },
    AddressModal: {
      screen: AddressModal,
    },
    ContactModal: {
      screen: ContactModal,
    },
    CurrencyModal: {
      screen: CurrencyModal,
    },
    QRModal: {
      screen: QRModal,
    },
    ViewAddress: {
      screen: ViewAddress,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
    cardStyle: { backgroundColor: 'transparent', shadowOpacity: 0 },
    transitionConfig: () => ({
      containerStyle: { backgroundColor: 'transparent' },
    }),
  }
);

/*
  Example usage:
  handleDeepLink('org.reactjs.native.example.Hoard://confirm_transaction/?params={"tx":"123","uid":"12"}')
 */

function handleDeepLink(deepLink) {
  const SCHEME = 'org.reactjs.native.example.Hoard://';
  let paths, params;

  let link = deepLink.replace(SCHEME, '');

  link = link.split('/');
  alert(`Deep Link: ${link[0]}`);

  if (link[link.length - 1].includes('?params=')) {
    params = link[link.length - 1];
    params = params.replace('?params=', '');
    alert(`Params: ${params}`);
  }

  if (link[0] === 'confirm_transaction') {
    NavigatorService.navigateDeep([
      { routeName: 'Wallet' },
      { routeName: 'Confirm', params: JSON.parse(params) },
    ]);
  } else {
    // TODO handle default or unhandled deeplinks
    NavigatorService.navigate('Dashboard');
  }
}

export default class App extends React.Component {
  constructor() {
    super();
    if (__DEV__) {
      YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated']);
    }
  }

  componentWillMount() {
    /* HockeyApp.configure(Config.HOCKEYAPP_API_KEY, true);*/
  }

  componentDidMount() {
    /* HockeyApp.start();*/
    /* HockeyApp.checkForUpdate();*/
    SplashScreen.hide();
  }

  refDidLoad = navigatorRef => {
    NavigatorService.setContainer(navigatorRef);

    if (!store.getState().app.hasPreviouslyInitialized) {
      store.dispatch({ type: INIT_REQUESTING });
    }
  };

  componentWillMount() {
    UrbanAirship.getChannelId().then(channelId => {
      // this.setState({channelId:channelId})
    });

    UrbanAirship.addListener('notificationResponse', response => {
      console.log('notificationResponse:', JSON.stringify(response));
      alert('notificationResponse: ' + response.notification.alert);
    });

    UrbanAirship.addListener('pushReceived', notification => {
      console.log('pushReceived:', JSON.stringify(notification));
      alert('pushReceived: ' + notification.alert);
    });

    UrbanAirship.addListener('deepLink', event => {
      console.log('deepLink:', JSON.stringify(event));
      handleDeepLink(event.deepLink);
    });

    UrbanAirship.addListener('registration', event => {
      console.log('registration:', JSON.stringify(event));
      // this.state.channelId = event.channelId;
      // this.setState(this.state);
    });

    UrbanAirship.addListener('notificationOptInStatus', event => {
      console.log('notificationOptInStatus:', JSON.stringify(event));
    });
  }

  render() {
    return (
      <Provider store={store}>
        <LinearGradient
          start={gradients.topLeft.start}
          end={gradients.topLeft.end}
          colors={gradients.blue}
          style={styles.container}
        >
          <Notifications>
            <ModalStack ref={this.refDidLoad} />
          </Notifications>
        </LinearGradient>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});
