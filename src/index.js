// this shim must be loaded before bip39 or the bitcoin lib,
// to correctly initialize the "process" global variable that
// is expected to be available by their dependencies
import 'react-native-process-shim';

// This is to provide a catch for the case where a node.js
// module tries to create an error with a stack trace. The
// React Native error class does not have this method, but
// we still want the error to be surfaced.
// eslint-disable-next-line immutable/no-mutation
Error.createStackTrace = Error.createStackTrace || function() {
  return {};
};

import { AppRegistry } from 'react-native';
import App from './App';
AppRegistry.registerComponent('Hoard', () => App);
