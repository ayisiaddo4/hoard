import { AsyncStorage } from 'react-native';
import { TRANSACTION_FOUND } from './constants';
import { SYMBOL_BOAR } from 'containers/App/constants';
import { call, put } from 'redux-saga/effects';
import { bigNumberToEther } from 'lib/formatters';
import { TYPE_SEND, TYPE_REQUEST } from 'screens/SendRequest/constants';

import { provider, getBlock } from 'sagas/transactions/ethsagas';

export const LAST_BOAR_BLOCK_STORAGE_KEY = 'LAST_BOAR_BLOCK_STORAGE_KEY';

export function* fetchHistoryBoar({ wallet }) {
  try {
    const previousBlock = yield call(
      AsyncStorage.getItem,
      LAST_BOAR_BLOCK_STORAGE_KEY
    );

    const fromBlock = (previousBlock && Number(previousBlock)) || '0x305FC6';
    const address = yield call(wallet.getPublicAddress);
    let logs = yield call(() =>
      wallet._wallet.provider.getLogs({
        fromBlock,
        toBlock: 'latest',
        address: wallet._contract.address,
        topics: wallet._contract.interface.events.Transfer.topics,
      })
    );

    const lastFetchedBlock = yield provider.getBlock();

    for (const log of logs) {
      const fromTopic = log.topics[1];
      const toTopic = log.topics[2];

      const from = `${fromTopic.slice(0, 2)}${fromTopic.slice(26)}`;
      const to = `${toTopic.slice(0, 2)}${toTopic.slice(26)}`;

      const isFrom = from.toLowerCase() === address.toLowerCase();
      const isTo = to.toLowerCase() === address.toLowerCase();
      const isMine = isFrom || isTo;

      if (isMine) {
        const block = yield call(getBlock, log.blockNumber);

        const amount = bigNumberToEther(
          wallet._contract.interface.events.Transfer.parse(log.data)._value
        );

        const transaction = {
          type: isFrom ? TYPE_SEND : TYPE_REQUEST,
          date: block.timestamp * 1000,
          symbol: SYMBOL_BOAR,
          from: isFrom ? address : from,
          to: isTo ? address : to,
          amount,
          price: Number(amount) * 0.46,
          fiatTrade: false,
          details: {
            ...log,
            hash: log.transactionHash,
          },
        };

        yield put({
          type: TRANSACTION_FOUND,
          transaction,
        });
      }
    }

    yield call(
      AsyncStorage.setItem,
      LAST_BOAR_BLOCK_STORAGE_KEY,
      lastFetchedBlock.number.toString()
    );
  } catch (e) {
    if (__DEV__) {
      console.log('An error occurred while fetching BOAR transacions: ', e);
    }
  }
}
