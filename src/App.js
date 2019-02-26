import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import { AsyncStorage, StyleSheet, YellowBox } from 'react-native';

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
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { INIT_REQUESTING } from './containers/App/constants';
import { gradients } from 'styles';
import LinearGradient from 'react-native-linear-gradient';
import RNConfig from 'react-native-config';
import CONFIG from 'src/config';

if (CONFIG.USE_REACTOTRON) {
  var Reactotron = require('./ReactotronConfig').default;
}

import {
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
          header: null,
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
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
      },
    },
    transitionConfig,
    transparentCard: true,
    cardShadowEnabled: false,
  }
);

const ModalStack = createAppContainer(createStackNavigator(
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
    transparentCard: true,
    cardShadowEnabled: false,
    transitionConfig: () => ({containerStyle: {}}),
  }
));

class App extends Component {
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

  refDidLoad = async navigatorRef =>
    NavigatorService.setContainer(navigatorRef);

  componentDidMount = async () => {
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
        NavigatorService.resetTo({ routeName: 'Main' }, { routeName: 'Login' });
      }

      this.props.store.dispatch({ type: INIT_REQUESTING });
    }

    SplashScreen.hide();
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
