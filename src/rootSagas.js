/**
|--------------------------------------------------
| Root Saga - combines all sagas throughout the app
|--------------------------------------------------

Usage:
import example from "path/to/Example/sagas";

Add to rootSaga's all method:
yield all([example(), ...otherSagas]);

*/

import { all } from 'redux-saga/effects';
import CONFIG from 'src/config';

import settingsSagas from 'screens/Settings/sagas';
import authSagas from 'sagas/authentication';
import contactsSagas from 'sagas/contacts';
import transactionSagas from 'sagas/transactions';
import initSagas from 'sagas/init';
import updatesSagas from 'sagas/updatesSagas';
import walletSagas from 'screens/Wallet/sagas';
import pricingSagas from 'sagas/pricing/saga';
import kycStatusWatcher from 'screens/KYC/sagas';
import notificationSagas from 'containers/Notifications/sagas';

const rootSagas = [
  initSagas(),
  settingsSagas(),
  authSagas(),
  contactsSagas(),
  walletSagas(),
  pricingSagas(),
  transactionSagas(),
  kycStatusWatcher(),
  notificationSagas(),
];

if (CONFIG.CODEPUSH_IS_ENABLED) {
  rootSagas.push(updatesSagas());
}

export default function* rootSaga() {
  yield all(rootSagas);
}
