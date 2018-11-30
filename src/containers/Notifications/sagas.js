import Config from 'react-native-config';
import api from 'lib/api';

import { all, select, take, takeLatest, takeEvery, call, put } from "redux-saga/effects";

import {
  TYPE_SEND,
  TYPE_REQUEST
} from 'screens/SendRequest/constants';

import {
  NOTIFICATION_DISMISSED,
  NOTIFICATION_UPDATED,
  NOTIFICATIONS_START_FLOW,
  NOTIFICATION_FLOW_TYPE_CONTACT_FULFILLMENT,
  NOTIFICATION_RECIEVED
} from './constants';

import {
  notificationDismissed,
  notificationRecieved,
  notificationUpdated,
  startNotificationFlow,
} from './actions';

import {
  cancelContactTransaction
} from "sagas/transactions/actions";

import {
  CANCEL_CONTACT_TRANSACTION_SUCCESS,
  CANCEL_CONTACT_TRANSACTION_FAILURE,
} from 'sagas/transactions/constants';

import {
  RECIPIENT_TYPE_OTHER,
} from 'screens/SendRequest/constants';

import { walletsForSymbolSelector } from 'screens/Wallet/selectors';


import NavigatorService from 'lib/navigator';


import StoreRegistry from 'lib/store-registry';

const KICKOFF_PROMPT_CONTACT_SAGA = 'saga/notifications/prompt_contact';
const KICKOFF_CANCEL_CONTACT_SAGA = 'saga/notifications/cancel_contact';
const KICKOFF_REQUEST_CONTACT_SAGA = 'saga/notifications/request_contact';
const KICKOFF_ERROR_CONTACT_SAGA = 'saga/notifications/error_contact';

function* errorContact({notification, error}) {
  yield put(notificationUpdated({
    ...notification,
    title: 'An Error Occurred',
    content: error || 'Please try again later',
    icon: require('assets/exclamation-circle.png'),
    loading: false,
    actions: [
      {title: 'Dismiss', onPress: () => StoreRegistry.getStore().dispatch(notificationDismissed(notification))}
    ]
  }));
}

function* cancelContact({notification, transaction}) {
  yield put(cancelContactTransaction(transaction));

  const waitForTransaction = function* () {
    const action = yield take([CANCEL_CONTACT_TRANSACTION_SUCCESS, CANCEL_CONTACT_TRANSACTION_FAILURE]);

    if (action.transaction.details.uid === transaction.details.uid) {
      if (action.type === CANCEL_CONTACT_TRANSACTION_SUCCESS) {
        yield put(notificationUpdated({
          ...notification,
          title: 'Cancellation Successful',
          content: `${transaction.details.recipient} will be informed that you have cancelled this transaction.`,
          icon: require('assets/success-circle-white.png'),
          loading: false,
          actions: [
            {title: 'Dismiss', onPress: () => StoreRegistry.getStore().dispatch(notificationDismissed(notification))}
          ]
        }));
      } else {
        yield put({
          type: KICKOFF_ERROR_CONTACT_SAGA,
          notification
        });
      }

    } else {
      yield call(waitForTransaction);
    }
  };

  yield call(waitForTransaction);
}

function* promptContact({notification, transaction}) {
    yield put(notificationUpdated({
      ...notification,
      title: 'Notifying User',
      content: 'Please hold...',
      loading: true,
      actions: []
    }));

    try {
      const response = yield api.post(`${Config.EREBOR_ENDPOINT}/contacts/transaction/${transaction.details.uid}/notify`);
      if (response.success) {
        yield put(notificationUpdated({
          ...notification,
          title: 'Thanks!',
          content: response.success[0],
          icon: require('assets/new_user.png'),
          loading: false,
          actions: [
            {title: 'Dismiss', onPress: () => StoreRegistry.getStore().dispatch(notificationDismissed(notification))}
          ]
        }));
      }
    } catch(e) {
      yield put({
        type: KICKOFF_ERROR_CONTACT_SAGA,
        notification,
        error: e && e.errors && e.errors[0] && e.errors[0].message || null
      });
    }
}

function* fulfillTransaction(arg) {
  const transaction = arg.transaction;
  const { notification } = yield put(notificationRecieved({
    type: 'secondary',
    title: 'Checking user status',
    content: 'Looking to see if the user you are trying to send to has signed up for an account',
    icon: require('assets/exclamation-circle.png'),
    loading: true,
    actions: []
  }));

  const request = api.get(`${Config.EREBOR_ENDPOINT}/contacts/transaction/${transaction.details.uid}/recipient_status`);
  try {
    const results = yield request;
    if (transaction.type === TYPE_SEND) {
      const wallet = yield select(state => walletsForSymbolSelector(state, transaction.symbol)[0]);
      NavigatorService.navigate('SendRequest', {
        type: TYPE_SEND,
        wallet: wallet.id,
        type: transaction.type,
        recipient: transaction.details.recipient,
        recipientAddress: results.address,
        recipientType: RECIPIENT_TYPE_OTHER,
        amount: transaction.amount,
        transaction_uid: transaction.details.uid
      });
      StoreRegistry.getStore().dispatch(notificationDismissed(notification));
    } else {
      yield put(notificationUpdated({
        ...notification,
        title: `${transaction.details.recipient} has signed up for an account!`,
        content: 'Would you like to prompt them again about this transaction?',
        icon: require('assets/new_user.png'),
        loading: false,
        actions: [
          {title: 'Dismiss', onPress: () => StoreRegistry.getStore().dispatch(notificationDismissed(notification))},
          {title: 'Prompt', onPress: () => StoreRegistry.getStore().dispatch({
            type: KICKOFF_PROMPT_CONTACT_SAGA,
            notification,
            transaction
          })}
        ]
      }));
    }
  } catch (e) {
    if (e.errors.length && e.errors[0].code === 117) {
      yield put(notificationUpdated({
        ...notification,
        title: 'Non-active Recipient',
        content: 'The recipient has not signed up for an account',
        icon: require('assets/new_user.png'),
        loading: false,
        actions: [
          {title: 'Cancel Transaction', onPress: () => StoreRegistry.getStore().dispatch({
            type: KICKOFF_CANCEL_CONTACT_SAGA,
            notification,
            transaction
          })},
          {title: 'Prompt', onPress: () => StoreRegistry.getStore().dispatch({
            type: KICKOFF_PROMPT_CONTACT_SAGA,
            notification,
            transaction
          })}
        ]
      }));
    } else {
      yield put({
        type: KICKOFF_ERROR_CONTACT_SAGA,
        notification
      });
    }
  }
}

function* flowHandler(action) {
  if (action.flowType === NOTIFICATION_FLOW_TYPE_CONTACT_FULFILLMENT) {
    yield fulfillTransaction(action);
  }
}

export default function* pricingSagaWatcher() {
  yield all([
    takeEvery(NOTIFICATIONS_START_FLOW, flowHandler),
    takeEvery(KICKOFF_ERROR_CONTACT_SAGA, errorContact),
    takeEvery(KICKOFF_CANCEL_CONTACT_SAGA, cancelContact),
    takeEvery(KICKOFF_PROMPT_CONTACT_SAGA, promptContact),
  ]);
}
