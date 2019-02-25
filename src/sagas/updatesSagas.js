/**
|--------------------------------------------------
| Code Push Saga
|--------------------------------------------------
*
*  Check in with Code Push for updates and dispatch updating accordingly.
*
*/

import { spawn } from 'redux-saga/effects';
import codePush from 'react-native-code-push';
import codePushSaga from 'react-native-code-push-saga';
import Config from 'react-native-config';

function* checkForUpdates() {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log(
      `------- STARTING CODE PUSH FOR: ${
        Config.CODEPUSH_DEPLOYMENT_KEY
      } -------- `
    );
  }

  yield spawn(codePushSaga, {
    syncOnInterval: 60, // in seconds
    deploymentKey: Config.CODEPUSH_DEPLOYMENT_KEY,
    syncOnResume: false, //
    delayByInterval: 10 * 60, // wait 10 minutes before checking
    // syncActionName: "CUSTOM_SYNC", // extra redux actions to listen on
    updateDialog: false, // disabled as per iOS guidelines
    syncOptions: {
      installMode: codePush.InstallMode.ON_NEXT_RESUME,
    },
  });
}

export default function* updatesSagas() {
  yield checkForUpdates();
}
