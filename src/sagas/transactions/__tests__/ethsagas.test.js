import { ethers } from 'ethers';
import { AsyncStorage } from 'react-native';
import { call, put } from 'redux-saga/effects';
import { WALLET_CREATE_SUCCESS } from 'screens/Wallet/constants';
import {
  BLOCK_ADDED_TO_QUEUE,
  BLOCK_NUMBER_STORAGE_KEY,
  INTERESTING_BLOCK_FOUND,
  SEARCH_FOR_INTERESTING_BLOCKS,
} from '../constants';

import {
  blockAddedToQueue,
  blockUpdated,
  interestingBlockFound,
} from '../actions';

import * as transactionSagas from '../ethsagas';

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

describe('Transaction Sagas -- Ethereum', () => {
  describe('listeners', () => {
    const transactionListeners = transactionSagas.default().next().value.ALL;
    it('should set up all listeners', () => {
      expect(transactionListeners).toBeDefined();

      const initializer = transactionListeners.find(
        l => l.CALL && l.CALL.fn === transactionSagas.initialize
      );

      expect(initializer).toBeDefined();
    });

    it('should listen for block found events', () => {
      const blockFound = transactionListeners.find(
        l => l.FORK && l.FORK.args[0] === INTERESTING_BLOCK_FOUND
      );

      expect(blockFound).toBeDefined();
      expect(blockFound.FORK.args[1]).toEqual(transactionSagas.addBlockToQueue);
    });

    it('should set up wallet event listeners on wallet creation', () => {
      const walletCreate = transactionListeners.find(
        l => l.FORK && l.FORK.args[0] === WALLET_CREATE_SUCCESS
      );

      expect(walletCreate).toBeDefined();
      expect(walletCreate.FORK.args[1]).toEqual(
        transactionSagas.listenForWalletEvents
      );
    });

    it('should listen for block search events', () => {
      const searchListener = transactionListeners.find(
        l => l.FORK && l.FORK.args[0] === SEARCH_FOR_INTERESTING_BLOCKS
      );

      expect(searchListener).toBeDefined();
      expect(searchListener.FORK.args[1]).toEqual(
        transactionSagas.fetchHistoryEth
      );
    });
  });

  describe('initialization', () => {
    describe('setup processes', () => {
      const initializedProcesses = runTillDone(transactionSagas.initialize());

      it('should setup continual listeners', () => {
        expect(
          initializedProcesses.find(
            p =>
              p.FORK && p.FORK.fn === transactionSagas.setupActionBridgeChannel
          )
        ).toBeDefined();
        expect(
          initializedProcesses.find(
            p =>
              p.FORK &&
              p.FORK.fn === transactionSagas.processTransactionsBlockQueue
          )
        ).toBeDefined();
      });

      it('should hydrate the app with saved state', () => {
        expect(
          initializedProcesses.find(
            p => p.CALL && p.CALL.fn === transactionSagas.hydrate
          )
        ).toBeDefined();
      });
    });

    describe('action bridge', () => {
      it('should forward all actions from the channel to the main thread', () => {
        const listener = transactionSagas.setupActionBridgeChannel();
        expect(listener.next().value.TAKE.channel).toEqual(
          transactionSagas.actionBridgeChannel
        );
        expect(listener.next('hi').value.PUT.action).toEqual('hi');

        // should then listen for the next action to come through
        expect(listener.next().value.TAKE.channel).toEqual(
          transactionSagas.actionBridgeChannel
        );
      });
    });

    describe('interesting block processor', () => {
      it('should wait for a block to be added to the queue when the queue is empty', () => {
        const processor = transactionSagas.processTransactionsBlockQueue();
        expect(transactionSagas.transactionsBlockQueue.length).toEqual(0);
        expect(processor.next().value.TAKE.pattern).toEqual(
          BLOCK_ADDED_TO_QUEUE
        );
      });

      it('should process the next transaction when the queue has length', () => {
        const processor = transactionSagas.processTransactionsBlockQueue();

        transactionSagas.transactionsBlockQueue.push({});

        expect(transactionSagas.transactionsBlockQueue.length).toEqual(1);

        const next = processor.next().value;
        expect(
          next.TAKE && next.TAKE.pattern === BLOCK_ADDED_TO_QUEUE
        ).toBeFalsy();

        transactionSagas.transactionsBlockQueue.pop();
        expect(transactionSagas.transactionsBlockQueue.length).toEqual(0);
      });

      describe('successful search', () => {
        const processor = transactionSagas.processTransactionsBlockQueue();
        const fakeBlock = { block: 1, transactionCount: 2 };
        const fakeWallet = { walletAddresses: 'a' };
        it('should initiate a search for the each item in the queue for all your ethereum addresses', () => {
          transactionSagas.transactionsBlockQueue.push(fakeBlock);
          expect(processor.next().value.CALL.fn).toEqual(
            transactionSagas.transactionsBlockQueue.pop
          );

          expect(processor.next(fakeBlock).value.SELECT).toBeTruthy();
          const search = processor.next(fakeWallet).value.CALL;
          expect(search).toBeDefined();

          expect(search.fn).toBe(transactionSagas.searchBlockForTransactions);

          expect(search.args).toEqual([
            fakeBlock.block,
            fakeWallet.walletAddresses,
            fakeBlock.transactionCount,
          ]);

          transactionSagas.transactionsBlockQueue.pop();
        });

        it('should restart the process', () => {
          expect(processor.next().value.TAKE.pattern).toEqual(
            BLOCK_ADDED_TO_QUEUE
          );
        });
      });
    });

    describe('hydration process', () => {
      it('should be able to handle when there is no saved block number', () => {
        const hydrateSaga = transactionSagas.hydrate();
        const savedCall = hydrateSaga.next();

        expect(savedCall.value.CALL).toBeDefined();
        expect(savedCall.value.CALL.fn).toBe(AsyncStorage.getItem);
        expect(savedCall.value.CALL.args[0]).toBe(BLOCK_NUMBER_STORAGE_KEY);

        const expectedFinish = hydrateSaga.next();
        expect(expectedFinish.done).toBeTruthy();
        expect(expectedFinish.value).toEqual({});
      });

      it('should be able to handle when there is a corrupted block number', () => {
        const hydrateSaga = transactionSagas.hydrate();
        const savedCall = hydrateSaga.next();

        expect(savedCall.value.CALL).toBeDefined();
        expect(savedCall.value.CALL.fn).toBe(AsyncStorage.getItem);
        expect(savedCall.value.CALL.args[0]).toBe(BLOCK_NUMBER_STORAGE_KEY);

        const expectedFinish = hydrateSaga.next('{ unparseable');
        expect(expectedFinish.done).toBeTruthy();
        expect(expectedFinish.value).toEqual({});
      });

      it('should be able to handle when there is a saved block number', () => {
        const hydrateSaga = transactionSagas.hydrate();
        const savedCall = hydrateSaga.next();

        expect(savedCall.value.CALL).toBeDefined();
        expect(savedCall.value.CALL.fn).toBe(AsyncStorage.getItem);
        expect(savedCall.value.CALL.args[0]).toBe(BLOCK_NUMBER_STORAGE_KEY);

        const expectedFinish = hydrateSaga.next('{"a":0}');
        expect(expectedFinish.done).toBeTruthy();
        expect(expectedFinish.value).toEqual({ a: 0 });
      });
    });
  });

  describe('block number helpers', () => {
    describe('update', () => {
      it('should update the local block number', () => {
        const previousa = transactionSagas.lastCheckedBlockNumber['a'];
        runTillDone(transactionSagas.updateLastCheckedBlockNumber('a', 1234));

        expect(transactionSagas.lastCheckedBlockNumber['a']).toEqual(1234);

        runTillDone(
          transactionSagas.updateLastCheckedBlockNumber('a', previousa)
        );
      });

      it('should save the block number to the device', () => {
        const previousa = transactionSagas.lastCheckedBlockNumber['a'];
        const updates = runTillDone(
          transactionSagas.updateLastCheckedBlockNumber('a', 1234)
        );

        const storageCall = updates.find(
          u => u.CALL && u.CALL.fn === AsyncStorage.setItem
        );
        expect(storageCall).toBeDefined();
        expect(storageCall.CALL.args).toEqual([
          BLOCK_NUMBER_STORAGE_KEY,
          JSON.stringify(transactionSagas.lastCheckedBlockNumber),
        ]);

        runTillDone(
          transactionSagas.updateLastCheckedBlockNumber('a', previousa)
        );
      });

      it('should notify the app that the block number has been updated', () => {
        const previousa = transactionSagas.lastCheckedBlockNumber['a'];
        const updates = runTillDone(
          transactionSagas.updateLastCheckedBlockNumber('a', 1234)
        );

        const updatePut = updates.find(u => u.PUT);
        expect(updatePut).toBeDefined();
        expect(updatePut.PUT.action).toEqual(blockUpdated());

        runTillDone(
          transactionSagas.updateLastCheckedBlockNumber('a', previousa)
        );
      });
    });

    describe('get', () => {
      it('should return the last checked block number for address when saved', () => {
        const previousa = transactionSagas.lastCheckedBlockNumber['a'];
        runTillDone(transactionSagas.updateLastCheckedBlockNumber('a', 1234));

        expect(transactionSagas.getLastCheckedBlockForAddress('a')).toEqual(
          1234
        );

        runTillDone(
          transactionSagas.updateLastCheckedBlockNumber('a', previousa)
        );
      });

      it('should return 0 for address when not', () => {
        const previousb = transactionSagas.lastCheckedBlockNumber['b'];
        runTillDone(transactionSagas.updateLastCheckedBlockNumber('b', null));

        expect(transactionSagas.getLastCheckedBlockForAddress('b')).toEqual(0);

        runTillDone(
          transactionSagas.updateLastCheckedBlockNumber('b', previousb)
        );
      });
    });
  });

  describe('when a block is found', () => {
    it('should add block to queue and trigger event', () => {
      expect(transactionSagas.transactionsBlockQueue.length).toBe(0);

      const saga = transactionSagas.addBlockToQueue({ block: 1 });
      const put = saga.next();

      expect(put.value.PUT).toBeDefined();
      expect(put.value.PUT.action).toEqual(blockAddedToQueue());

      expect(transactionSagas.transactionsBlockQueue.pop()).toEqual(1);
    });
  });

  describe('search for blocks that may contain transactions', () => {
    describe('starting the search', () => {
      it('should be able to handle a failure of the blockNumber call', () => {
        const hydrateSaga = transactionSagas.fetchHistoryEth({
          publicAddress: 'a',
        });
        const getPreviousNumber = hydrateSaga.next();

        expect(getPreviousNumber.value.CALL).toBeDefined();
        expect(getPreviousNumber.value.CALL.fn).toBe(
          transactionSagas.getLastCheckedBlockForAddress
        );
        expect(getPreviousNumber.value.CALL.args[0]).toBe('a');

        hydrateSaga.next(12);
        const expectedAll = hydrateSaga.throw(new Error('heyyo'));

        expect(expectedAll.value.ALL).toEqual([]);

        const updateToBlock = hydrateSaga.next();

        expect(updateToBlock.value.CALL).toBeDefined();
        expect(updateToBlock.value.CALL.fn).toBe(
          transactionSagas.updateLastCheckedBlockNumber
        );
        expect(updateToBlock.value.CALL.args).toEqual(['a', 12]);

        const expectedFinish = hydrateSaga.next();
        expect(expectedFinish.done).toBeTruthy();
      });

      it('should kick of search for a given address between the last checked block and the most recent block', () => {
        const hydrateSaga = transactionSagas.fetchHistoryEth({
          publicAddress: 'a',
        });
        hydrateSaga.next();
        hydrateSaga.next(12);
        const expectedAll = hydrateSaga.next(34);

        expect(expectedAll.value.ALL).toEqual([
          call(transactionSagas.searchForInterestingBlocks, 'a', 12, 34),
        ]);

        const updateToBlock = hydrateSaga.next();
        expect(updateToBlock.value.CALL.args).toEqual(['a', 34]);
        const expectedFinish = hydrateSaga.next();
        expect(expectedFinish.done).toBeTruthy();
      });

      it('should kick off searches for items that errored when they were last attempted', () => {
        transactionSagas.searchInRangeList.push({
          publicAddress: 'b',
          startBlockNumber: 76,
          endBlockNumber: 98,
        });
        const hydrateSaga = transactionSagas.fetchHistoryEth({
          publicAddress: 'a',
        });
        hydrateSaga.next();
        hydrateSaga.next(12);
        const expectedAll = hydrateSaga.next(34);

        expect(expectedAll.value.ALL).toEqual([
          call(transactionSagas.searchForInterestingBlocks, 'b', 76, 98),
          call(transactionSagas.searchForInterestingBlocks, 'a', 12, 34),
        ]);

        const updateToBlock = hydrateSaga.next();
        expect(updateToBlock.value.CALL.args).toEqual(['a', 34]);
        const expectedFinish = hydrateSaga.next();
        expect(expectedFinish.done).toBeTruthy();
        expect(transactionSagas.searchInRangeList).toEqual([]);
      });
    });

    it('should put this search back into the queue when an error happens', () => {
      const searchFn = transactionSagas.searchForInterestingBlocks('a', 0, 10);
      searchFn.next().value.CALL;
      const expectedFinish = searchFn.throw(new Error('wut'));
      expect(expectedFinish.done).toBeTruthy();
      expect(transactionSagas.searchInRangeList).toEqual([
        {
          publicAddress: 'a',
          startBlockNumber: 0,
          endBlockNumber: 10,
        },
      ]);
    });

    it('should cut off the recursive search when all values are equal', () => {
      const searchFn = transactionSagas.searchForInterestingBlocks('a', 0, 10);
      const startValuesCall = searchFn.next().value.CALL;
      const endValuesCall = searchFn.next(1).value.CALL;

      const startBalanceCall = searchFn.next(1).value.CALL;
      const endBalanceCall = searchFn.next(2).value.CALL;

      const expectedEnd = searchFn.next(2);

      expect(startValuesCall.fn).toEqual(transactionSagas.getTransactionCount);
      expect(startValuesCall.args).toEqual(['a', 0]);

      expect(endValuesCall.fn).toEqual(transactionSagas.getTransactionCount);
      expect(endValuesCall.args).toEqual(['a', 10]);

      expect(startBalanceCall.fn).toEqual(transactionSagas.getBalance);
      expect(startBalanceCall.args).toEqual(['a', 0]);

      expect(endBalanceCall.fn).toEqual(transactionSagas.getBalance);
      expect(endBalanceCall.args).toEqual(['a', 10]);

      expect(expectedEnd.done).toEqual(true);
    });

    it('should set the transaction count to inifinity when there is an unknown price discrepancy', () => {
      const searchFn = transactionSagas.searchForInterestingBlocks('a', 0, 1);
      searchFn.next().value.CALL;
      searchFn.next(1).value.CALL;

      searchFn.next(1).value.CALL;
      searchFn.next(2).value.CALL;

      const expectedEnd = searchFn.next(3).value.PUT;
      expect(expectedEnd.action).toEqual(
        interestingBlockFound({
          block: 1,
          publicAddress: 'a',
          transactionCount: Infinity,
        })
      );
    });

    it('should rerun this function on both halves of interesting ranges if there is a halfway point between start and end blocks', () => {
      const searchFn = transactionSagas.searchForInterestingBlocks('a', 0, 2);
      searchFn.next().value.CALL;
      searchFn.next(1).value.CALL;

      const expectedFirstHalf = searchFn.next(3).value.FORK;
      const expectedSecondHalf = searchFn.next().value.FORK;

      expect(expectedFirstHalf.fn).toEqual(
        transactionSagas.searchForInterestingBlocks
      );
      expect(expectedFirstHalf.args).toEqual(['a', 0, 1]);

      expect(expectedSecondHalf.fn).toEqual(
        transactionSagas.searchForInterestingBlocks
      );
      expect(expectedSecondHalf.args).toEqual(['a', 1, 2]);
    });

    it('should return the end block if there is nothing else to search through', () => {
      const searchFn = transactionSagas.searchForInterestingBlocks('a', 0, 1);
      searchFn.next().value.CALL;
      searchFn.next(1).value.CALL;

      const expectedEnd = searchFn.next(3).value.PUT;
      expect(expectedEnd.action).toEqual(
        interestingBlockFound({
          block: 1,
          publicAddress: 'a',
          transactionCount: 2,
        })
      );
    });
  });

  describe('search for transactions in an interesting block', () => {
    it('should get the block info for that block', () => {
      const searchFn = transactionSagas.searchBlockForTransactions(
        1,
        ['a', 'b'],
        3
      );
      const blockCall = searchFn.next();
      expect(blockCall.value.CALL.fn).toEqual(transactionSagas.getBlock);
      expect(blockCall.value.CALL.args).toEqual([1]);
    });

    it('should put the block back in the queue if an error occurs', () => {
      const searchFn = transactionSagas.searchBlockForTransactions(
        1,
        ['a', 'b'],
        3
      );
      searchFn.next();
      const putBackInQueue = searchFn.throw(new Error());
      expect(putBackInQueue.value).toEqual(
        put(interestingBlockFound({ block: 1, transactionCount: 3 }))
      );

      const expectedFinish = searchFn.next();
      expect(expectedFinish.done).toBeTruthy();
    });

    describe('for a given transaction', () => {
      it('should get the full transaction', () => {
        const searchFn = transactionSagas.searchBlockForTransactions(
          1,
          ['a', 'b'],
          3
        );
        searchFn.next();
        const transactionCall = searchFn.next({ transactions: [11, 22, 33] });

        expect(transactionCall.value.CALL.fn).toEqual(
          transactionSagas.getTransaction
        );
        expect(transactionCall.value.CALL.args).toEqual([11]);
      });

      it('should get the price for the time the transaction was mined', () => {
        const searchFn = transactionSagas.searchBlockForTransactions(
          1,
          ['a', 'b'],
          3
        );
        searchFn.next();
        searchFn.next({ timestamp: 987, transactions: [11, 22, 33] });
        const priceCall = searchFn.next({ to: 'a' });

        expect(priceCall.value.CALL.fn).toEqual(
          transactionSagas.timestampPriceApi.makeRequest
        );
        expect(priceCall.value.CALL.args[0].includes(`ts=987`)).toBeTruthy();
      });

      it('should emit an event if the address is in the "to" field', () => {
        const searchFn = transactionSagas.searchBlockForTransactions(
          1,
          ['a', 'b'],
          3
        );
        searchFn.next();
        searchFn.next({ timestamp: 987, transactions: [11, 22, 33] });
        searchFn.next({
          to: 'a',
          from: 'not',
          gasPrice: '',
          gasLimit: '',
          value: '',
        });
        const transactionFoundPut = searchFn.next({ ETH: { USD: 1234 } });

        expect(transactionFoundPut.value.PUT).toBeDefined();
        expect(transactionFoundPut.value.PUT.action.transaction.to).toBe('a');
      });

      it('should emit an event if the address is in the "from" field', () => {
        const searchFn = transactionSagas.searchBlockForTransactions(
          1,
          ['a', 'b'],
          3
        );
        searchFn.next();
        searchFn.next({ timestamp: 987, transactions: [11, 22, 33] });
        searchFn.next({
          to: 'not',
          from: 'a',
          gasPrice: '',
          gasLimit: '',
          value: '',
        });
        const transactionFoundPut = searchFn.next({ ETH: { USD: 1234 } });

        expect(transactionFoundPut.value.PUT).toBeDefined();
        expect(transactionFoundPut.value.PUT.action.transaction.from).toBe('a');
      });

      it('should not emit an event if the address is in neither "to" or "from"', () => {
        const searchFn = transactionSagas.searchBlockForTransactions(
          1,
          ['a', 'b'],
          3
        );
        searchFn.next();
        searchFn.next({ timestamp: 987, transactions: [11, 22, 33] });
        searchFn.next({
          to: 'not',
          from: 'not',
          gasPrice: '',
          gasLimit: '',
          value: '',
        });
        const transactionFoundPut = searchFn.next({ ETH: { USD: 1234 } });

        expect(transactionFoundPut.value.PUT).not.toBeDefined();
      });

      it('convert the bigNumber representation of wei values to ether number string', () => {
        const searchFn = transactionSagas.searchBlockForTransactions(
          1,
          ['a', 'b'],
          3
        );
        searchFn.next();
        searchFn.next({ timestamp: 987, transactions: [11, 22, 33] });
        searchFn.next({
          to: 'a',
          from: 'not',
          gasPrice: ethers.utils.bigNumberify(1e10),
          gasLimit: ethers.utils.bigNumberify(2e9),
          value: ethers.utils.bigNumberify(3e8),
        });
        const transactionFoundPut = searchFn.next({ ETH: { USD: 1234 } });

        expect(transactionFoundPut.value.PUT).toBeDefined();
        const transaction = transactionFoundPut.value.PUT.action.transaction;
        expect(transaction.gasPrice).toBe('0.00000001');
        expect(transaction.gasLimit).toBe('0.000000002');
        expect(transaction.value).toBe('0.0000000003');
      });

      it('add the mining time to the transaction, in milliseconds', () => {
        const searchFn = transactionSagas.searchBlockForTransactions(
          1,
          ['a', 'b'],
          3
        );
        searchFn.next();
        searchFn.next({ timestamp: 987, transactions: [11, 22, 33] });
        searchFn.next({
          to: 'a',
          from: 'not',
          gasPrice: '',
          gasLimit: '',
          value: '',
        });
        const transactionFoundPut = searchFn.next({ ETH: { USD: 1234 } });

        expect(transactionFoundPut.value.PUT).toBeDefined();
        const transaction = transactionFoundPut.value.PUT.action.transaction;
        expect(transaction.timeMined).toBe(987000);
      });

      it('add price at the the mining time to the transaction', () => {
        const searchFn = transactionSagas.searchBlockForTransactions(
          1,
          ['a', 'b'],
          3
        );
        searchFn.next(); // block call
        searchFn.next({ timestamp: 987, transactions: [11, 22, 33] });
        searchFn.next({
          to: 'a',
          from: 'not',
          gasPrice: '',
          gasLimit: '',
          value: '',
        }); // price call
        const transactionFoundPut = searchFn.next({ ETH: { USD: 1234 } });

        expect(transactionFoundPut.value.PUT).toBeDefined();
        const transaction = transactionFoundPut.value.PUT.action.transaction;
        expect(transaction.priceAtTimeMined).toBe(1234);
      });
    });

    it('should stop the search when we have found enough transactions', () => {
      // this test will find the 1 transaction on the second iteration
      const searchFn = transactionSagas.searchBlockForTransactions(
        1,
        ['a', 'b'],
        1
      );
      searchFn.next(); // block call

      searchFn.next({ timestamp: 987, transactions: [11, 22, 33] }); // transaction call
      searchFn.next({
        to: 'not',
        from: 'not',
        gasPrice: '',
        gasLimit: '',
        value: '',
      }); // second transaction call
      searchFn.next({
        to: 'a',
        from: 'not',
        gasPrice: '',
        gasLimit: '',
        value: '',
      }); // price call
      const transactionFoundPut = searchFn.next({ ETH: { USD: 1234 } });

      expect(transactionFoundPut.value.PUT).toBeDefined();

      const finish = searchFn.next();
      expect(finish.done).toBe(true);
      expect(finish.value.length).toBe(1);
    });

    it("should loop through all transactions when we don't know how many transactions to look for", () => {
      const searchFn = transactionSagas.searchBlockForTransactions(
        1,
        ['a', 'b'],
        Infinity
      );
      searchFn.next(); // block call

      searchFn.next({ timestamp: 987, transactions: [11, 22, 33] }); // transaction call
      searchFn.next({
        to: 'not',
        from: 'not',
        gasPrice: '',
        gasLimit: '',
        value: '',
      }); // secondTransactionCall
      searchFn.next({
        to: 'a',
        from: 'not',
        gasPrice: '',
        gasLimit: '',
        value: '',
      }); // priceCall

      const transactionFoundPut = searchFn.next({ ETH: { USD: 1234 } });
      expect(transactionFoundPut.value.PUT).toBeDefined();

      searchFn.next(); // thirdTransactionCall

      const finish = searchFn.next({
        to: 'not',
        from: 'not',
        gasPrice: '',
        gasLimit: '',
        value: '',
      });
      expect(finish.done).toBe(true);
      expect(finish.value.length).toBe(1);
    });
  });
});
