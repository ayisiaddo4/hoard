import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import { UrbanAirship } from 'urbanairship-react-native';
import { Alert, StyleSheet, Text, YellowBox, View } from 'react-native';

import NavigatorService from 'lib/navigator';
import configureStore from './configureStore';
import StoreRegistry from 'lib/store-registry';

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

if (__DEV__) {
  var Reactotron = require('./ReactotronConfig').default;
}

import {
  cardStyle,
  transitionConfig,
  getNavigationOptions,
} from 'components/Base/Navigation';

export const store = configureStore();
StoreRegistry.setStore(store);
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
  handleDeepLink('com.hoardinc.Hoard://confirm_transaction/?params={"tx":"123","uid":"12"}')
 */

function handleDeepLink(deepLink) {
  const SCHEME = 'com.hoardinc.Hoard://';
  let paths, params;

  let link = deepLink.replace(SCHEME, '');

  link = link.split('/');
  Alert.alert(`Deep Link: ${link[0]}`);

  if (link[link.length - 1].includes('?params=')) {
    params = link[link.length - 1];
    params = params.replace('?params=', '');
    Alert.alert(`Params: ${params}`);
  }

  if (link[0] === 'confirm_transaction') {

    try {
      params = JSON.parse(params);
    } catch (e) {
      params = '{}';
    }

    NavigatorService.navigateDeep([
      { routeName: 'Wallet' },
      { routeName: 'Confirm', params: params},
    ]);
  } else {
    // TODO handle default or unhandled deeplinks
    NavigatorService.navigate('Dashboard');
  }
}

class App extends React.Component {
  constructor() {
    super();

    if (__DEV__) {
      YellowBox.ignoreWarnings([
        'Warning: isMounted(...) is deprecated',
        'Require cycle:',
        'Require cycle: ',
      ]);
    }
  }

  state = {
    notificationsEnabled: false,
    channelId: 'na',
  };

  static getDerivedStateFromProps(props, state) {
    if (state.notificationsEnabled !== props.enablePushNotifications) {
      const newState = state;
      newState.notificationsEnabled = props.enablePushNotifications;
      return newState;
    }
    return null;
  }

  refDidLoad = navigatorRef => {
    NavigatorService.setContainer(navigatorRef);

    if (!this.props.hasPreviouslyInitialized) {
      this.props.store.dispatch({ type: INIT_REQUESTING });
    }
  };

  async getChannelId() {
    const id = await UrbanAirship.getChannelId();
    console.log('id---->', id);
    this.setState({ channelId: id });
  }

  componentDidMount() {
    SplashScreen.hide();

    this.getChannelId().done();

    this.handleNotificationResponse = UrbanAirship.addListener(
      'notificationResponse',
      response => {
        // eslint-disable-next-line no-console
        console.log('notificationResponse:', JSON.stringify(response));
      }
    );

    this.handlePushReceived = UrbanAirship.addListener(
      'pushReceived',
      notification => {
        // eslint-disable-next-line no-console
        console.log('pushReceived:', JSON.stringify(notification));
      }
    );

    this.handleDeepLink = UrbanAirship.addListener('deepLink', event => {
      // eslint-disable-next-line no-console
      console.log('deepLink:', JSON.stringify(event));
      handleDeepLink(event.deepLink);
    });

    this.handleRegistration = UrbanAirship.addListener(
      'registration',
      event => {
        this.setState({ channelId: event.channelId });
        // eslint-disable-next-line no-console
        console.log('registration:', JSON.stringify(event));
      }
    );

    this.handleNotificationOptInStatus = UrbanAirship.addListener(
      'notificationOptInStatus',
      event => {
        // eslint-disable-next-line no-console
        console.log('notificationOptInStatus:', JSON.stringify(event));
      }
    );

    UrbanAirship.isUserNotificationsEnabled().then(enabled => {
      this.setState({ notificationsEnabled: enabled });
    });
  }

  componentWillUnmount() {
    this.handleNotificationResponse.remove();
    this.handlePushReceived.remove();
    this.handleDeepLink.remove();
    this.handleRegistration.remove();
    this.handleNotificationOptInStatus.remove();
  }

  render() {
    const { notificationsEnabled, channelId } = this.state;
    return (
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
    );
  }
}

App.propTypes = {
  hasPreviouslyInitialized: PropTypes.bool.isRequired,
  store: PropTypes.object.isRequired,
  enablePushNotifications: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }
});

// We will want the root-level app aware of user preferences, in order
// to intercept and reroute push notification action, so we need to connect()
// the app.

const mapStateToProps = state => {
  return {
    hasPreviouslyInitialized: state.app.hasPreviouslyInitialized,
    enablePushNotifications: state.settings.enablePushNotifications,
  };
};

const ReactotronApp = __DEV__ ? Reactotron.overlay(App) : App;

const ConnectedApp = connect(mapStateToProps)(ReactotronApp);

const ProviderApp = () => (
  <Provider store={store}>
    <ConnectedApp store={store} />
  </Provider>
);

export default ProviderApp;
