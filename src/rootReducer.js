/**
|--------------------------------------------------
| Root Reducer - combines all reducers throughout the app
|--------------------------------------------------

Usage:
import example from "path/to/Example/reducer";

Add to combineReducers:
combineReducers({
  example,
  ...
});

*/

import { combineReducers } from 'redux';
import app from 'containers/App/reducer';
import user from 'containers/User/reducer';
import contacts from 'sagas/contacts/reducer';
import login from 'screens/Login/reducer';
import signup from 'screens/Signup/reducer';
import wallet from 'screens/Wallet/reducer';
import notifications from 'containers/Notifications/reducer';
import receiveModal from 'containers/ReceiveModal/reducer';
import sendModal from 'containers/SendModal/reducer';
import pricing from 'sagas/pricing/reducer';
import settings from 'screens/Settings/reducer';
import loadingReducer from 'screens/LoadingScreen/reducer';
import transactions from 'sagas/transactions/reducer';
import transactionStatus from 'screens/TransactionStatus/reducer';
import kyc from 'screens/KYC/reducer';

const rootReducer = combineReducers({
  app,
  user,
  contacts,
  login,
  signup,
  wallet,
  receiveModal,
  sendModal,
  pricing,
  settings,
  transactions,
  transactionStatus,
  kyc,
  loadingReducer,
  notifications,
});

export default rootReducer;
