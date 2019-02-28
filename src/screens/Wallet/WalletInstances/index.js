import {
  SYMBOL_ETH,
  SYMBOL_HOARD,
  SYMBOL_BTC,
  SYMBOL_RVN,
} from 'containers/App/constants';
import EthWallet from './EthWallet';
import HoardWallet from './HoardWallet';
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

export function initializeWallet(
  symbol,
  isMnemonic,
  mnemonicOrPrivateKey,
  additionalInfo
) {
  switch (symbol) {
    case SYMBOL_ETH: {
      return new EthWallet(isMnemonic, mnemonicOrPrivateKey, additionalInfo);
    }
    case SYMBOL_HOARD: {
      return new HoardWallet(isMnemonic, mnemonicOrPrivateKey, additionalInfo);
    }
    case SYMBOL_BTC: {
      return new BtcWallet(isMnemonic, mnemonicOrPrivateKey, additionalInfo);
    }
    case SYMBOL_RVN: {
      return new RvnWallet(isMnemonic, mnemonicOrPrivateKey, additionalInfo);
    }
    default:
      throw Error(`there is no wallet generation method for ${symbol}`);
  }
}
