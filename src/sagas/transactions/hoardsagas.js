import { AsyncStorage } from 'react-native';
import { SYMBOL_HOARD } from 'containers/App/constants';
import { call, put, takeEvery } from 'redux-saga/effects';
import { bigNumberToEther } from 'lib/formatters';
import { TYPE_SEND, TYPE_REQUEST } from 'screens/SendRequest/constants';
import {
  transactionFound,
  searchForTransactions,
} from 'sagas/transactions/actions';
import {
  WALLET_IMPORT_SUCCESS,
  WALLET_TRACK_SYMBOL_SUCCESS,
} from 'screens/Wallet/constants';

import { updateBalance } from 'screens/Wallet/actions';
import { provider } from 'sagas/transactions/ethsagas';
import {
  actionBridgeChannel,
  asyncNextFrame,
} from 'sagas/transactions/helpers';

import { getWalletInstance } from 'screens/Wallet/sagas';

export const LAST_HOARD_BLOCK_STORAGE_KEY = 'LAST_HOARD_BLOCK_STORAGE_KEY';

const HOARD_BASE_PRICE = 0.035;

export default function* hoardTransactionsSagaWatcher() {
  yield takeEvery(
    [WALLET_IMPORT_SUCCESS, WALLET_TRACK_SYMBOL_SUCCESS],
    initialize
  );
}

export function* initialize(action) {
  const { symbol, publicAddress, id } = action.payload;
  if (symbol === SYMBOL_HOARD) {
    const wallet = getWalletInstance(id);
    // A filter from me to anyone
    const filterFromMe = wallet._contract.filters.Transfer(publicAddress);

    // A filter from anyone to me
    const filterToMe = wallet._contract.filters.Transfer(null, publicAddress);

    // A filter from me AND to me
    const filterFromMeToMe = wallet._contract.filters.Transfer(
      publicAddress,
      publicAddress
    );

    wallet._contract.on(filterFromMe, eventCallback(TYPE_SEND, id));
    wallet._contract.on(filterToMe, eventCallback(TYPE_REQUEST, id));
    wallet._contract.on(filterFromMeToMe, eventCallback(TYPE_SEND, id));

    yield put(searchForTransactions(id));
  }
}

const eventCallback = (type, walletId) => async (
  fromAddress,
  toAddress,
  value,
  event
) => {
  await asyncNextFrame();
  const block = await event.getBlock();
  const amount = bigNumberToEther(value);
  const transaction = {
    type,
    date: block.timestamp * 1000,
    symbol: SYMBOL_HOARD,
    from: fromAddress,
    to: toAddress,
    amount,
    price: Number(amount * HOARD_BASE_PRICE),
    fiatTrade: false,
    details: {
      ...event,
      hash: event.transactionHash,
    },
  };
  actionBridgeChannel.put(transactionFound(transaction));
  actionBridgeChannel.put(updateBalance(walletId));
};

export function* fetchHistoryHoard({ id }) {
  const wallet = getWalletInstance(id);

  try {
    const previousBlock = yield call(
      AsyncStorage.getItem,
      LAST_HOARD_BLOCK_STORAGE_KEY
    );

    const fromBlock = (previousBlock && Number(previousBlock)) || '0x305FC6';
    const address = yield call(wallet.getPublicAddress);
    const logs = yield call(() =>
      wallet._wallet.provider.getLogs({
        fromBlock,
        toBlock: 'latest',
        address: wallet._contract.address,
        topics: [wallet._contract.interface.events.Transfer.topic],
      })
    );

    const lastFetchedBlock = yield provider.getBlock();

    for (const log of logs) {
      yield call(asyncNextFrame);
      const fromTopic = log.topics[1];
      const toTopic = log.topics[2];

      const from = `${fromTopic.slice(0, 2)}${fromTopic.slice(26)}`;
      const to = `${toTopic.slice(0, 2)}${toTopic.slice(26)}`;

      const isFrom = from.toLowerCase() === address.toLowerCase();
      const isTo = to.toLowerCase() === address.toLowerCase();
      const isMine = isFrom || isTo;

      if (isMine) {
        const block = yield provider.getBlock(log.blockNumber);

        const amount = bigNumberToEther(
          wallet._contract.interface.events.Transfer.decode(log.data)._value
        );

        const transaction = {
          type: isFrom ? TYPE_SEND : TYPE_REQUEST,
          date: block.timestamp * 1000,
          symbol: SYMBOL_HOARD,
          from: isFrom ? address : from,
          to: isTo ? address : to,
          amount,
          price: Number(amount * HOARD_BASE_PRICE),
          fiatTrade: false,
          details: {
            ...log,
            hash: log.transactionHash,
          },
        };

        yield put(transactionFound(transaction));
      }
    }

    yield call(
      AsyncStorage.setItem,
      LAST_HOARD_BLOCK_STORAGE_KEY,
      lastFetchedBlock.number.toString()
    );
  } catch (e) {
    if (__DEV__) {
      console.log('An error occurred while fetching HOARD transacions: ', e);
    }
  }
}
