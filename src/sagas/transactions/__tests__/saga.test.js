import { INIT_REQUESTING } from 'containers/App/constants';
import { AsyncStorage } from 'react-native';
import {
  TRANSACTION_FOUND,
  SEARCH_FOR_TRANSACTIONS,
  TRANSACTION_UPDATE,
  TRANSACTIONS_STORAGE_KEY,
} from '../constants';
import { transactionFound } from '../actions';
import ethSagas, { fetchHistoryEth } from '../ethsagas';
import * as transactionSagas from '../index';

const runTillDone = saga => {
  const values = [];
  while (true) {
    // eslint-disable-line no-constant-condition
    const result = saga.next();
    if (!result.done) {
      values.push(result.value);
    } else {
      break;
    }
  }
  return values;
};

describe('Transaction Sagas', () => {
  describe('listeners', () => {
    const transactionListeners = transactionSagas.default().next().value.ALL;
    it('should set up all listeners', () => {
      expect(transactionListeners).toBeDefined();
    });

    it('should have an initialization function', () => {
      const initListener = transactionListeners.find(
        l => l.FORK.args[0] === INIT_REQUESTING
      );

      expect(initListener).toBeDefined();
      expect(initListener.FORK.args[1]).toEqual(transactionSagas.initialize);
    });

    it('found and updated transactions should save to device', () => {
      const foundListener = transactionListeners.find(
        l => l.FORK.args[1] === TRANSACTION_FOUND
      );

      const updateListener = transactionListeners.find(
        l => l.FORK.args[1] === TRANSACTION_UPDATE
      );

      const fakeAction = { type: '1', transaction: { hash: 'heyyyo' } };

      expect(foundListener).toBeTruthy();
      expect(updateListener).toBeTruthy();

      expect(foundListener.FORK.args[2]).toEqual(updateListener.FORK.args[2]);

      const actionToSaveForwarder = foundListener.FORK.args[2](fakeAction);
      expect(actionToSaveForwarder.next().value.CALL.fn).toEqual(
        transactionSagas.saveTransactions
      );
    });

    it('should listen for history fetch events', () => {
      const foundListener = transactionListeners.find(
        l => l.FORK.args[0] === SEARCH_FOR_TRANSACTIONS
      );

      expect(foundListener).toBeTruthy();
      expect(foundListener.FORK.args[1]).toEqual(transactionSagas.fetchHistory);
    });
  });

  describe('initialization', () => {
    it('should spin up symbol specific history fetchers', () => {
      const initializers = runTillDone(transactionSagas.initialize());

      const ethFork = initializers.find(l => l.FORK && l.FORK.fn === ethSagas);

      const hydrator = initializers.find(
        l => l.CALL && l.CALL.fn === transactionSagas.hydrate
      );

      expect(ethFork).toBeTruthy();
      expect(hydrator).toBeTruthy();
    });

    describe('should fetch previously found transactions from device', () => {
      it('should broadcast transaction found event for every saved transaction', () => {
        const hydrateSaga = transactionSagas.hydrate();
        const savedCall = hydrateSaga.next();

        expect(savedCall.value.CALL).toBeDefined();
        expect(savedCall.value.CALL.fn).toBe(AsyncStorage.getItem);
        expect(savedCall.value.CALL.args[0]).toBe(TRANSACTIONS_STORAGE_KEY);

        const subsequentCalls = [
          hydrateSaga.next(
            JSON.stringify({
              a: { e: 1 },
              b: { f: 1 },
              c: { g: 1 },
              d: { h: 1 },
            })
          ).value,
          ...runTillDone(hydrateSaga),
        ];

        expect(subsequentCalls.map(c => c.PUT.action)).toEqual([
          transactionFound({ e: 1 }, true),
          transactionFound({ f: 1 }, true),
          transactionFound({ g: 1 }, true),
          transactionFound({ h: 1 }, true),
        ]);
      });

      it('should not broadcast transaction events if there are no saved transactions', () => {
        const hydrateSaga = transactionSagas.hydrate();
        const savedCall = hydrateSaga.next();

        expect(savedCall.value.CALL).toBeDefined();
        expect(savedCall.value.CALL.fn).toBe(AsyncStorage.getItem);
        expect(savedCall.value.CALL.args[0]).toBe(TRANSACTIONS_STORAGE_KEY);

        const expectedFinish = hydrateSaga.next();
        expect(expectedFinish.done).toBeTruthy();
      });

      it('should gracefully handle a malformed response from the device', () => {
        const hydrateSaga = transactionSagas.hydrate();
        const savedCall = hydrateSaga.next();

        expect(savedCall.value.CALL).toBeDefined();
        expect(savedCall.value.CALL.fn).toBe(AsyncStorage.getItem);
        expect(savedCall.value.CALL.args[0]).toBe(TRANSACTIONS_STORAGE_KEY);

        const expectedFinish = hydrateSaga.next('{ unparseable ');

        expect(expectedFinish.done).toBeTruthy();
      });
    });
  });

  describe('fetchHistory', () => {
    it('should forward history request to the appropriate handler for the symbol when the wallet is found', () => {
      const action = { address: 'a' };
      const fetchHistorySaga = transactionSagas.fetchHistory(action);
      const selectCall = fetchHistorySaga.next();
      expect(selectCall.value.SELECT).toBeDefined();
      const storageCall = fetchHistorySaga.next(
        selectCall.value.SELECT.selector({
          wallet: { wallets: { a: { symbol: 'ETH' } } },
        })
      );
      expect(storageCall.value.CALL).toBeDefined();
      expect(storageCall.value.CALL.fn).toBe(fetchHistoryEth);
      expect(storageCall.value.CALL.args[0]).toBe(action);

      expect(fetchHistorySaga.next().done).toBeTruthy();
    });
    it('should not trigger an action when there is no associated wallet', () => {
      const action = { address: 'b' };
      const fetchHistorySaga = transactionSagas.fetchHistory(action);
      const selectCall = fetchHistorySaga.next();
      expect(selectCall.value.SELECT).toBeDefined();
      const expectedFinish = fetchHistorySaga.next(
        selectCall.value.SELECT.selector({
          wallet: { wallets: { a: { symbol: 'ETH' } } },
        })
      );
      expect(expectedFinish.value).not.toBeDefined();
      expect(expectedFinish.done).toBeTruthy();
    });
    it('should not trigger an action when the symbol desired does not have a history fetcher', () => {
      const action = { address: 'a' };
      const fetchHistorySaga = transactionSagas.fetchHistory(action);
      const selectCall = fetchHistorySaga.next();
      expect(selectCall.value.SELECT).toBeDefined();
      const expectedFinish = fetchHistorySaga.next(
        selectCall.value.SELECT.selector({
          wallet: { wallets: { a: { symbol: 'BTC' } } },
        })
      );
      expect(expectedFinish.value).not.toBeDefined();
      expect(expectedFinish.done).toBeTruthy();
    });
  });

  describe('transaction found / update', () => {
    it('should save the current transaction state', () => {
      const saveSaga = transactionSagas.saveTransactions();
      const selectCall = saveSaga.next();

      expect(selectCall.value.SELECT).toBeDefined();
      const storageCall = saveSaga.next(
        selectCall.value.SELECT.selector({
          transactions: { transactions: { a: 1, b: 1, c: 1 } },
        })
      );
      expect(storageCall.value.CALL).toBeDefined();
      expect(storageCall.value.CALL.fn).toBe(AsyncStorage.setItem);
      expect(storageCall.value.CALL.args[0]).toBe(TRANSACTIONS_STORAGE_KEY);
      expect(storageCall.value.CALL.args[1]).toBe('{"a":1,"b":1,"c":1}');

      expect(saveSaga.next().done).toBeTruthy();
    });
  });
});
