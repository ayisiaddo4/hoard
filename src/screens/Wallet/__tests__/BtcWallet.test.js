import Config from 'react-native-config';
import BtcWallet from '../WalletInstances/BtcWallet';
import RvnWallet from '../WalletInstances/RvnWallet';

const mnemonicPhrase =
  'zero zero zero zero zero zero zero zero zero zero zero zero';

describe('Testing BTC Wallet', () => {
  let walletInstance; // eslint-disable-line immutable/no-let

  beforeAll(() => {
    walletInstance = new BtcWallet(true, mnemonicPhrase);
  });

  test('Wallet Initializes Properly', () => {
    expect(typeof walletInstance).toBe('object');
    expect(walletInstance).toBeInstanceOf(BtcWallet);
    expect(walletInstance).not.toBeInstanceOf(RvnWallet);
  });

  test('Wallet Initializes with correct symbol', () => {
    const expected = 'BTC';
    const unexpected = 'RVN';
    expect(walletInstance.symbol).toBe(expected);
    expect(walletInstance.symbol).not.toBe(unexpected);
  });

  test('Wallet Initializes with correct derivation path', () => {
    const expected = `m/44'/${Config.BTC_COINPATH}'/0'/0/0`;
    const unexpected = `m/44'/${Config.RVN_COINPATH}'/0'/0/0`;
    expect(walletInstance._derivationPath).toEqual(expected);
    expect(walletInstance._derivationPath).not.toEqual(unexpected);
  });
});
