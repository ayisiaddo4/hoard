import {
  SYMBOL_ETH,
  SYMBOL_HOARD,
  SYMBOL_BTC,
  SYMBOL_RVN,
} from 'containers/App/constants';
import EthWallet from './EthWallet';
import BoarWallet from './BoarWallet';
import BtcWallet from './BtcWallet';
import RvnWallet from './RvnWallet';

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
    case SYMBOL_HOARD: {
      return new BoarWallet(isMnemonic, mnemonicOrPrivateKey);
    }
    case SYMBOL_BTC: {
      return new BtcWallet(isMnemonic, mnemonicOrPrivateKey);
    }
    case SYMBOL_RVN: {
      return new RvnWallet(isMnemonic, mnemonicOrPrivateKey);
    }
    default:
      throw Error(`there is no wallet generation method for ${symbol}`);
  }
}
