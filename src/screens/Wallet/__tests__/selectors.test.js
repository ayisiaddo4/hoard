import { trackSymbolSuccess } from '../actions';

import reducer from '../../../rootReducer';

import {
  walletSelector,
  allWalletsSelector,
  walletsForSymbolSelector,
} from '../selectors';

describe('Wallets Selectors', () => {
  describe('allWalletsSelector', () => {
    it('should return an empty list when there are no wallets', () => {
      expect(allWalletsSelector(reducer(undefined, {}))).toEqual([]);
    });

    it('should return all wallets that exist in the state', () => {
      const walletA = {
        id: 'a',
        publicAddress: 'q',
        imported: false,
        symbol: 'a',
        balance: 2,
      };

      const withOneWallet = reducer(undefined, trackSymbolSuccess(walletA));
      expect(allWalletsSelector(withOneWallet)).toEqual([walletA]);

      const walletB = {
        id: 'b',
        publicAddress: 'z',
        imported: false,
        symbol: 'b',
        balance: 2,
      };

      const withTwoWallets = reducer(
        withOneWallet,
        trackSymbolSuccess(walletB)
      );
      expect(allWalletsSelector(withTwoWallets)).toEqual([walletA, walletB]);
    });
  });

  describe('walletsForSymbolSelector', () => {
    it('should return an empty list when there are no wallets', () => {
      expect(walletsForSymbolSelector(reducer(undefined, {}))).toEqual([]);
    });

    it('should return an empty list when there are no wallets of that symbol', () => {
      expect(walletsForSymbolSelector(reducer(undefined, {}))).toEqual([]);
    });

    it('should return all wallets that exist in the state for that symbol', () => {
      const walletA = {
        id: 'a',
        publicAddress: 'q',
        imported: false,
        symbol: 'a',
        balance: 2,
      };

      const withOneWallet = reducer(undefined, trackSymbolSuccess(walletA));
      expect(walletsForSymbolSelector(withOneWallet, 'a')).toEqual([walletA]);

      const walletB = {
        id: 'b',
        publicAddress: 'z',
        imported: false,
        symbol: 'b',
        balance: 2,
      };

      const withTwoWallets = reducer(
        withOneWallet,
        trackSymbolSuccess(walletB)
      );
      expect(walletsForSymbolSelector(withTwoWallets, 'a')).toEqual([walletA]);

      const walletC = {
        id: 'c',
        publicAddress: 'x',
        imported: false,
        symbol: 'a',
        balance: 2,
      };

      const withThreeWallets = reducer(
        withTwoWallets,
        trackSymbolSuccess(walletC)
      );

      expect(walletsForSymbolSelector(withThreeWallets, 'a')).toEqual([
        walletA,
        walletC,
      ]);

      const a = walletsForSymbolSelector(withThreeWallets, 'a');
      const b = walletsForSymbolSelector(withThreeWallets, 'a');

      expect(a === b).toBe(true);
    });
  });

  describe('walletSelector', () => {
    it('should return undefined when there is no wallet', () => {
      expect(walletSelector(reducer(undefined, {}), 'b')).not.toBeDefined();
    });

    it('should return all wallets that exist in the state', () => {
      const walletA = {
        id: 'a',
        publicAddress: 'q',
        imported: false,
        symbol: 'a',
        balance: 2,
      };

      const walletB = {
        id: 'b',
        imported: false,
        publicAddress: 'z',
        symbol: 'b',
        balance: 2,
      };

      const withOneWallet = reducer(undefined, trackSymbolSuccess(walletA));
      const withTwoWallets = reducer(
        withOneWallet,
        trackSymbolSuccess(walletB)
      );

      expect(walletSelector(withOneWallet, 'a')).toEqual(walletA);
      expect(walletSelector(withTwoWallets, 'a')).toEqual(walletA);
    });
  });
});
