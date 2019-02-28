import Config from 'react-native-config';
import { Platform, Alert } from 'react-native';
import { UrbanAirship } from 'urbanairship-react-native';
import api from 'lib/api';
import DeviceInfo from 'react-native-device-info';
import { toTitleCase } from 'lib/string-helpers';

import {
  all,
  select,
  take,
  takeLatest,
  takeEvery,
  call,
  put,
} from 'redux-saga/effects';

import {
  TYPE_SEND,
  TYPE_REQUEST,
  RECIPIENT_TYPE_OTHER,
} from 'screens/SendRequest/constants';
import { SYMBOL_RVN } from 'containers/App/constants';

import {
  NOTIFICATION_DISMISSED,
  NOTIFICATION_UPDATED,
  NOTIFICATIONS_START_FLOW,
  NOTIFICATION_FLOW_TYPE_CONTACT_FULFILLMENT,
  NOTIFICATION_FLOW_TYPE_UPGRADE_BAD_RVN_DERIVATION_PATH,
  NOTIFICATION_RECIEVED,
} from './constants';

import { INIT_REQUESTING } from 'containers/App/constants';

import { UPDATE_ENABLE_PUSH_NOTIFICATIONS } from 'screens/Settings/constants';

import {
  notificationDismissed,
  notificationRecieved,
  notificationUpdated,
  startNotificationFlow,
} from './actions';

import { cancelContactTransaction } from 'sagas/transactions/actions';

import {
  updateEnablePushNotifications,
  updateDeviceInfo,
} from 'screens/Settings/actions';

import {
  CANCEL_CONTACT_TRANSACTION_SUCCESS,
  CANCEL_CONTACT_TRANSACTION_FAILURE,
} from 'sagas/transactions/constants';

import { getWalletInstance } from 'screens/Wallet/sagas';
import {
  walletsForSymbolSelector,
  hoardWalletForSymbolSelector,
} from 'screens/Wallet/selectors';
import { sendFunds } from 'screens/Wallet/actions';
import { t } from 'translations/i18n';

import NavigatorService from 'lib/navigator';

import StoreRegistry from 'lib/store-registry';

const KICKOFF_PROMPT_CONTACT_SAGA = 'saga/notifications/prompt_contact';
const KICKOFF_CANCEL_CONTACT_SAGA = 'saga/notifications/cancel_contact';
const KICKOFF_ERROR_CONTACT_SAGA = 'saga/notifications/error_contact';

function* errorContact({ notification, error }) {
  yield put(
    notificationUpdated({
      ...notification,
      title: 'An Error Occurred',
      content: error || 'Please try again later',
      icon: require('assets/exclamation-circle.png'),
      loading: false,
      actions: [
        {
          title: 'Dismiss',
          onPress: () =>
            StoreRegistry.getStore().dispatch(
              notificationDismissed(notification)
            ),
        },
      ],
    })
  );
}

function* cancelContact({ notification, transaction }) {
  yield put(cancelContactTransaction(transaction));

  const waitForTransaction = function*() {
    const action = yield take([
      CANCEL_CONTACT_TRANSACTION_SUCCESS,
      CANCEL_CONTACT_TRANSACTION_FAILURE,
    ]);

    if (action.transaction.details.uid === transaction.details.uid) {
      if (action.type === CANCEL_CONTACT_TRANSACTION_SUCCESS) {
        yield put(
          notificationUpdated({
            ...notification,
            title: 'Cancellation Successful',
            content: `${
              transaction.details.recipient
            } will be informed that you have cancelled this transaction.`,
            icon: require('assets/success-circle-white.png'),
            loading: false,
            actions: [
              {
                title: 'Dismiss',
                onPress: () =>
                  StoreRegistry.getStore().dispatch(
                    notificationDismissed(notification)
                  ),
              },
            ],
          })
        );
      } else {
        yield put({ type: KICKOFF_ERROR_CONTACT_SAGA, notification });
      }
    } else {
      yield call(waitForTransaction);
    }
  };

  yield call(waitForTransaction);
}

function* promptContact({ notification, transaction }) {
  yield put(
    notificationUpdated({
      ...notification,
      title: 'Notifying User',
      content: 'Please hold...',
      loading: true,
      actions: [],
    })
  );

  try {
    const response = yield api.post(
      `${Config.EREBOR_ENDPOINT}/contacts/transaction/${
        transaction.details.uid
      }/notify`
    );
    if (response.success) {
      yield put(
        notificationUpdated({
          ...notification,
          title: 'Thanks!',
          content: response.success[0],
          icon: require('assets/new_user.png'),
          loading: false,
          actions: [
            {
              title: 'Dismiss',
              onPress: () =>
                StoreRegistry.getStore().dispatch(
                  notificationDismissed(notification)
                ),
            },
          ],
        })
      );
    }
  } catch (e) {
    yield put({
      type: KICKOFF_ERROR_CONTACT_SAGA,
      notification,
      error: (e && e.errors && e.errors[0] && e.errors[0].message) || null,
    });
  }
}

function* fulfillTransaction(arg) {
  const transaction = arg.transaction;
  const { notification } = yield put(
    notificationRecieved({
      type: 'secondary',
      title: 'Checking user status',
      content:
        'Looking to see if the user you are trying to send to has signed up for an account',
      icon: require('assets/exclamation-circle.png'),
      loading: true,
      actions: [],
    })
  );

  const request = api.get(
    `${Config.EREBOR_ENDPOINT}/contacts/transaction/${
      transaction.details.uid
    }/recipient_status`
  );
  try {
    const results = yield request;
    if (transaction.type === TYPE_SEND) {
      const wallet = yield select(
        state => walletsForSymbolSelector(state, transaction.symbol)[0]
      );
      NavigatorService.navigate('SendRequest', {
        wallet: wallet.id,
        type: transaction.type,
        recipient: transaction.details.recipient,
        recipientAddress: results.address,
        recipientType: RECIPIENT_TYPE_OTHER,
        amount: transaction.amount,
        transaction_uid: transaction.details.uid,
      });
      StoreRegistry.getStore().dispatch(notificationDismissed(notification));
    } else {
      yield put(
        notificationUpdated({
          ...notification,
          title: `${
            transaction.details.recipient
          } has signed up for an account!`,
          content:
            'Would you like to prompt them again about this transaction?',
          icon: require('assets/new_user.png'),
          loading: false,
          actions: [
            {
              title: 'Dismiss',
              onPress: () =>
                StoreRegistry.getStore().dispatch(
                  notificationDismissed(notification)
                ),
            },
            {
              title: 'Prompt',
              onPress: () =>
                StoreRegistry.getStore().dispatch({
                  type: KICKOFF_PROMPT_CONTACT_SAGA,
                  notification,
                  transaction,
                }),
            },
          ],
        })
      );
    }
  } catch (e) {
    if (e.errors && e.errors.length && e.errors[0].code === 117) {
      yield put(
        notificationUpdated({
          ...notification,
          title: 'Non-active Recipient',
          content: 'The recipient has not signed up for an account',
          icon: require('assets/new_user.png'),
          loading: false,
          actions: [
            {
              title: 'Cancel Transaction',
              onPress: () =>
                StoreRegistry.getStore().dispatch({
                  type: KICKOFF_CANCEL_CONTACT_SAGA,
                  notification,
                  transaction,
                }),
            },
            {
              title: 'Prompt',
              onPress: () =>
                StoreRegistry.getStore().dispatch({
                  type: KICKOFF_PROMPT_CONTACT_SAGA,
                  notification,
                  transaction,
                }),
            },
          ],
        })
      );
    } else {
      yield put({ type: KICKOFF_ERROR_CONTACT_SAGA, notification });
    }
  }
}

function* upgradeBadRvnDerivationPath(action) {
  const id = action.wallet.id;
  const walletInstance = getWalletInstance(id);
  const goodWallet = yield select(state =>
    hoardWalletForSymbolSelector(state, SYMBOL_RVN)
  );

  const { notification } = yield put(
    notificationRecieved({
      type: 'brand',
      title: t('notification_flows.upgrade_rvn.needs_updating_title'),
      content: t('notification_flows.upgrade_rvn.needs_updating_content'),
      icon: require('assets/exclamation-circle.png'),
      onDismiss: () => {},
      actions: [
        {
          title: toTitleCase(t('actions.dismiss')),
          onPress: () =>
            StoreRegistry.getStore().dispatch(
              notificationDismissed(notification)
            ),
        },
        {
          title: t(
            'notification_flows.upgrade_rvn.needs_updating_transfer_action'
          ),
          onPress: async () => {
            StoreRegistry.getStore().dispatch(
              notificationUpdated({
                ...notification,
                loading: true,
              })
            );

            try {
              const balance = await walletInstance.getBalance();
              if (balance > 0) {
                const fee = await walletInstance._estimateFee();

                const response = await walletInstance.send(
                  balance - fee,
                  goodWallet.publicAddress
                );

                StoreRegistry.getStore().dispatch(
                  notificationUpdated({
                    ...notification,
                    loading: false,
                    type: 'neutral',
                    title: t(
                      'notification_flows.upgrade_rvn.has_transferred_title'
                    ),
                    content: t(
                      'notification_flows.upgrade_rvn.has_transferred_content'
                    ),
                    actions: [
                      {
                        title: toTitleCase(t('actions.dismiss')),
                        onPress: () =>
                          StoreRegistry.getStore().dispatch(
                            notificationDismissed(notification)
                          ),
                      },
                    ],
                  })
                );

                await api.post(`${Config.EREBOR_ENDPOINT}/support`, {
                  email_address: 'info@hoardinvest.com',
                  name: 'Anonymous',
                  subject: 'TX fee to be reimbursed',
                  description: `${
                    action.wallet.publicAddress
                  } has transferred ${balance -
                    fee} Ravencoin to the new wallet ${
                    goodWallet.publicAddress
                  }. Transaction hash: ${response.txid}`,
                });
              } else {
                StoreRegistry.getStore().dispatch(
                  notificationUpdated({
                    ...notification,
                    loading: false,
                    type: 'neutral',
                    title: t(
                      'notification_flows.upgrade_rvn.needs_updating_title'
                    ),
                    content: t('notification_flows.upgrade_rvn.no_balance'),
                    actions: [
                      {
                        title: toTitleCase(t('actions.dismiss')),
                        onPress: () =>
                          StoreRegistry.getStore().dispatch(
                            notificationDismissed(notification)
                          ),
                      },
                    ],
                  })
                );
              }
            } catch (e) {
              const errorDescription = [
                e.name,
                e.message,
                typeof e === 'string' ? e : undefined,
              ]
                .filter(v => v)
                .concat(' ');
              StoreRegistry.getStore().dispatch(
                notificationUpdated({
                  ...notification,
                  loading: false,
                  type: 'error',
                  title: t('notification_flows.upgrade_rvn.error_title'),
                  content: t('notification_flows.upgrade_rvn.error_content', {
                    error: errorDescription,
                  }),
                  actions: [
                    {
                      title: toTitleCase(t('actions.dismiss')),
                      onPress: () =>
                        StoreRegistry.getStore().dispatch(
                          notificationDismissed(notification)
                        ),
                    },
                  ],
                })
              );
            }
          },
        },
      ],
    })
  );
}

function* flowHandler(action) {
  if (action.flowType === NOTIFICATION_FLOW_TYPE_CONTACT_FULFILLMENT) {
    yield fulfillTransaction(action);
  } else if (
    action.flowType === NOTIFICATION_FLOW_TYPE_UPGRADE_BAD_RVN_DERIVATION_PATH
  ) {
    yield upgradeBadRvnDerivationPath(action);
  }
}

function initialize() {
  if (!DeviceInfo.isEmulator()) {
    requestAnimationFrame(() => UrbanAirship.setUserNotificationsEnabled(true));

    UrbanAirship.addListener('registration', async ({ channelId }) => {
      const store = StoreRegistry.getStore();
      const device_type = Platform.OS;

      const isUserNotificationsEnabled = await UrbanAirship.isUserNotificationsEnabled();
      if (!isUserNotificationsEnabled) {
        UrbanAirship.setUserNotificationsEnabled(true);
      }
      const optInPushNotifications = await UrbanAirship.isUserNotificationsOptedIn();

      store.dispatch(updateDeviceInfo({ channel: channelId, device_type }));
      store.dispatch(updateEnablePushNotifications(optInPushNotifications));
    });
  }
}

/*
  Example usage:
  handleDeepLink('com.hoardinc.Hoard://confirm_transaction/?params={"tx":"123","uid":"12"}')
 */
function parseDeepLink(deepLink) {
  const SCHEME = 'com.hoardinc.Hoard://';
  const realLink = deepLink.replace(SCHEME, '');
  const [pathSection, parametersSection] = realLink.split('?');
  const paths = pathSection.split('/');

  let params;
  try {
    params = JSON.parse(parametersSection.replace('params=', ''));
  } catch (e) {
    params = {};
  }
  return { paths, params };
}

function handleDeepLink({ paths, params }) {
  const mainPath = paths[0];
  if (mainPath === 'contact_transaction') {
    const wallets = walletsForSymbolSelector(
      StoreRegistry.getStore().getState(),
      params.currency
    );
    NavigatorService.navigate('CoinInformation', {
      id: wallets[0].id,
      currency: params.currency,
    });
  } else if (mainPath === 'request_funds') {
    const wallets = walletsForSymbolSelector(
      StoreRegistry.getStore().getState(),
      params.currency
    );
    NavigatorService.navigate('SendRequest', {
      wallet: wallets[0].id,
      recipientType: RECIPIENT_TYPE_OTHER,
      type: TYPE_SEND,
      recipient: params.from,
      currency: params.currency,
      amount: params.amount,
    });
  } else if (mainPath === 'confirm_transaction') {
    NavigatorService.navigateDeep([
      {
        routeName: 'Wallet',
      },
      {
        routeName: 'Confirm',
        params: params,
      },
    ]);
  } else {
    // TODO handle default or unhandled deeplinks
    NavigatorService.navigate('Dashboard');
  }
}

function handleUrbanAirshipListeners(action) {
  if (action.enablePushNotifications) {
    UrbanAirship.addListener('notificationResponse', pushNotification => {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log('notificationResponse:', JSON.stringify(pushNotification));
      }
      const deepLink = parseDeepLink(
        pushNotification.notification.extras['^d']
      );
      handleDeepLink(deepLink);
    });

    UrbanAirship.addListener('pushReceived', pushNotification => {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log('pushReceived:', JSON.stringify(pushNotification));
      }
      const deepLink = parseDeepLink(pushNotification.extras['^d']);
      const mainPath = deepLink.paths[0];
      if (mainPath === 'contact_transaction') {
        const { notification } = StoreRegistry.getStore().dispatch(
          notificationRecieved({
            type: 'secondary',
            title: pushNotification.alert,
            content: '',
            actions: [
              {
                title: 'Dismiss',
                onPress: () =>
                  StoreRegistry.getStore().dispatch(
                    notificationDismissed(notification)
                  ),
              },
              {
                title: 'Go To Wallet',
                onPress: () => {
                  handleDeepLink(deepLink);
                  StoreRegistry.getStore().dispatch(
                    notificationDismissed(notification)
                  );
                },
              },
            ],
          })
        );
      } else if (mainPath === 'request_funds') {
        const { notification } = StoreRegistry.getStore().dispatch(
          notificationRecieved({
            type: 'secondary',
            title: pushNotification.alert,
            content: '',
            actions: [
              {
                title: 'Dismiss',
                onPress: () =>
                  StoreRegistry.getStore().dispatch(
                    notificationDismissed(notification)
                  ),
              },
              {
                title: 'Fulfill',
                onPress: () => {
                  handleDeepLink(deepLink);
                  StoreRegistry.getStore().dispatch(
                    notificationDismissed(notification)
                  );
                },
              },
            ],
          })
        );
      } else if (mainPath === 'transaction_confirmation') {
        const { notification } = StoreRegistry.getStore().dispatch(
          notificationRecieved({
            type: 'secondary',
            title: pushNotification.alert,
            content: '',
            actions: [
              {
                title: 'Dismiss',
                onPress: () =>
                  StoreRegistry.getStore().dispatch(
                    notificationDismissed(notification)
                  ),
              },
            ],
          })
        );
      }
    });
  } else {
    UrbanAirship.removeListener('pushReceived');
    UrbanAirship.removeListener('notificationResponse');
  }
}

export default function* notificationsSagaWatcher() {
  yield take(INIT_REQUESTING);
  yield call(initialize);

  yield all([
    takeEvery(NOTIFICATIONS_START_FLOW, flowHandler),
    takeEvery(KICKOFF_ERROR_CONTACT_SAGA, errorContact),
    takeEvery(KICKOFF_CANCEL_CONTACT_SAGA, cancelContact),
    takeEvery(KICKOFF_PROMPT_CONTACT_SAGA, promptContact),
    takeEvery(UPDATE_ENABLE_PUSH_NOTIFICATIONS, handleUrbanAirshipListeners),
  ]);
}
