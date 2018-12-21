import { SYMBOL_ETH, SYMBOL_BOAR, SYMBOL_BTC } from 'containers/App/constants';
import EthWallet from './EthWallet';
import BoarWallet from './BoarWallet';
import BtcWallet from './BtcWallet';

/*
  class Wallet {
  constructor(isMnemonic, initializer)
  symbol
  getBalance()
  getPublicAddress()
  getPrivateKey()
  send(amount, toAddress)
  }
*/

export function initializeWallet(symbol, isMnemonic, mnemonicOrPrivateKey) {
  switch (symbol) {
    case SYMBOL_ETH: {
      return new EthWallet(isMnemonic, mnemonicOrPrivateKey);
    }
    case SYMBOL_BOAR: {
      return new BoarWallet(isMnemonic, mnemonicOrPrivateKey);
    }
    case SYMBOL_BTC: {
      return new BtcWallet(isMnemonic, mnemonicOrPrivateKey);
    }
    default:
      throw Error(`there is no wallet generation method for ${symbol}`);
  }
}
