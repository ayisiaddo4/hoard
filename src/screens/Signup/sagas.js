/**
|--------------------------------------------------
| Signup Saga
|--------------------------------------------------
*
*  This handles all side-effects for new user signup.
*  Any token storage, anylitics tracking, or app
*  redirection can be triggered here.
*
*/

import { call, put, select } from 'redux-saga/effects';
import { SIGNUP_SUCCESS, SIGNUP_ERROR } from './constants';
import api from 'lib/api';
import { getErrorMessage } from 'lib/api-errors';
import { deviceInfoSelector } from 'screens/Settings/selectors';
import Config from 'react-native-config';

// TODO: abstract these into dev/prod files
const signupUrl = `${Config.EREBOR_ENDPOINT}/users/`;

async function signupApi(
  first_name,
  last_name,
  phone_number,
  email_address,
  username,
  password,
  device_info = null
) {
  const signupOptions = {
    first_name,
    last_name,
    phone_number,
    email_address,
    username,
    password,
  };

  if (device_info && device_info.device_type && device_info.channel) {
    signupOptions.device_info = device_info;
  }

  try {
    return api.post(signupUrl, signupOptions);
  } catch (error) {
    if (__DEV__) {
      console.log(error);
    }
    throw error;
  }
}

// This will be run when the SIGNUP_REQUESTING
export default function* signupFlow(action) {
  let response;
  try {
    const {
      first_name,
      last_name,
      phone_number,
      email_address,
      username,
      password,
    } = action;

    const deviceInfo = yield select(deviceInfoSelector);

    // pulls "calls" to our signupApi with our email and password
    // from our dispatched signup action, and will PAUSE
    // here until the API async function, is complete!
    response = yield call(
      signupApi,
      first_name,
      last_name,
      phone_number,
      email_address,
      username,
      password,
      deviceInfo
    );

    if (response.uid) {
      response.user_uid = response.user_uid || response.uid;
    }

    // when the above api call has completed it will "put",
    // or dispatch, an action of type SIGNUP_SUCCESS with
    // the successful response.
    yield put({ type: SIGNUP_SUCCESS, response });
  } catch (error) {
    // TODO: return nice-looking errors to the user
    yield put({
      type: SIGNUP_ERROR,
      error: getErrorMessage(error),
    });
  }

  return response;
}
