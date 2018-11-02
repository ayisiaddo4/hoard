import { SYMBOL_RVN } from "containers/App/constants";
import { getNetworkForCoin } from "lib/currency-metadata";
import BtcWallet from './BtcWallet';
import api from 'lib/api';
import Config from 'react-native-config';

const RavencoinNetworks = {
  'mainnet': {
    messagePrefix: '\x16Ravencoin Signed Message:\n',
    bech32: 'rc',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x3c,
    scriptHash: 0x7a,
    wif: 0x80
  },
  'testnet': {
    messagePrefix: '\x16Ravencoin Signed Message:\n',
    bech32: 'tr',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef
  }
};

export const config = {
  endpoint: Config.RVN_NODE_ENDPOINT,
  network: RavencoinNetworks[getNetworkForCoin(SYMBOL_RVN)],
  coinPath: Config.RVN_COINPATH
};

export default class RvnWallet extends BtcWallet {
  constructor(isMnemonic, initializer) {
    super(isMnemonic, initializer, config);
  }

  symbol = SYMBOL_RVN;
  config = config;
}
