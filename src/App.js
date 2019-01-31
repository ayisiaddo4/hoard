import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import { AsyncStorage, StyleSheet, YellowBox, AppState } from 'react-native';
import { UrbanAirship } from 'urbanairship-react-native';

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
import RNConfig from 'react-native-config';
import CONFIG from 'src/config';

if (CONFIG.USE_REACTOTRON) {
  var Reactotron = require('./ReactotronConfig').default;
}

import {
  cardStyle,
  transitionConfig,
  getNavigationOptions,
} from 'components/Base/Navigation';

import { getStoredMnemonic } from 'screens/Wallet/sagas';

export const store = configureStore();
StoreRegistry.setStore(store);
export let navigatorRef;

const RoutingStack = createStackNavigator(
  {
    LoadingScreen: {
      screen: LoadingScreen,
      navigationOptions: { header: null },
    },
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

class App extends Component {
  constructor() {
    super();
    console.log('UA: Background 3');

    if (__DEV__) {
      YellowBox.ignoreWarnings([
        'Warning: isMounted(...) is deprecated',
        'Require cycle:',
        'Require cycle: ',
      ]);
    }
    this.state = {
      appState: AppState.currentState,
    };
  }

  refDidLoad = async navigatorRef =>
    NavigatorService.setContainer(navigatorRef);

  componentDidMount = async () => {
    AppState.addEventListener('change', this._handleAppStateChange);

    if (!this.props.hasPreviouslyInitialized) {
      const previousNetworkType = await AsyncStorage.getItem(
        'CURRENCY_NETWORK_TYPE'
      );
      if (previousNetworkType !== RNConfig.CURRENCY_NETWORK_TYPE) {
        await AsyncStorage.clear();
        await AsyncStorage.setItem(
          'CURRENCY_NETWORK_TYPE',
          RNConfig.CURRENCY_NETWORK_TYPE
        );
      }

      // we don't need to wait for initialization if there is no mnemonic,
      // since there really isn't anything to set up at that point
      const mnemonic = await getStoredMnemonic();
      if (!mnemonic) {
        NavigatorService.resetReplace('LoadingScreen', 'Login');
      }

      this.props.store.dispatch({ type: INIT_REQUESTING });
    }

    UrbanAirship.getChannelId().then(channelId => {
      this.setState({ channelId: channelId });
    });

    UrbanAirship.isUserNotificationsEnabled().then(enabled => {
      this.setState({ notificationsEnabled: enabled });
    });

    UrbanAirship.isLocationEnabled().then(enabled => {
      this.setState({ locationEnabled: enabled });
    });

    UrbanAirship.addListener('notificationResponse', response => {
      console.log(
        'UA: APP ------------- notificationResponse:',
        JSON.stringify(response)
      );
      alert('notificationResponse: ' + response.notification.alert);
    });

    UrbanAirship.addListener('pushReceived', notification => {
      console.log(
        'UA: APP ------------- pushReceived:',
        JSON.stringify(notification)
      );
      alert('pushReceived: ' + notification.alert);
    });

    UrbanAirship.addListener('deepLink', event => {
      console.log('UA: APP ------------- deepLink:', JSON.stringify(event));
      alert('deepLink: ' + event.deepLink);
    });

    UrbanAirship.addListener('registration', event => {
      console.log('UA: APP ------------- registration:', JSON.stringify(event));
      this.state.channelId = event.channelId;
      this.setState(this.state);
    });

    UrbanAirship.addListener('notificationOptInStatus', event => {
      console.log(
        'UA: APP ------------- notificationOptInStatus:',
        JSON.stringify(event)
      );
    });

    SplashScreen.hide();
  };

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('UA: App has come to the foreground!');
    }
    console.log('UA: APP SATE!', nextAppState);

    this.setState({ appState: nextAppState });
  };

  render() {
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
};

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

// We will want the root-level app aware of user preferences, in order
// to intercept and reroute push notification action, so we need to connect()
// the app.

const mapStateToProps = state => {
  return {
    hasPreviouslyInitialized: state.app.hasPreviouslyInitialized,
  };
};

const ReactotronApp = CONFIG.USE_REACTOTRON ? Reactotron.overlay(App) : App;

const ConnectedApp = connect(mapStateToProps)(ReactotronApp);

const ProviderApp = () => (
  <Provider store={store}>
    <ConnectedApp store={store} />
  </Provider>
);

export default ProviderApp;
