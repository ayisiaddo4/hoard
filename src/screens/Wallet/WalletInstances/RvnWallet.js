import { SYMBOL_RVN } from 'containers/App/constants';
import { NOTIFICATION_FLOW_TYPE_UPGRADE_BAD_RVN_DERIVATION_PATH } from 'containers/Notifications/constants';
import { getNetworkForCoin } from 'lib/currency-metadata';
import BtcWallet from './BtcWallet';
import Config from 'react-native-config';

const RavencoinNetworks = {
  mainnet: {
    messagePrefix: '\x16Raven Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x3c,
    scriptHash: 0x7a,
    wif: 0x80,
  },
  testnet: {
    messagePrefix: '\x16Ravencoin Signed Message:\n',
    bech32: 'tr',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394,
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
  },
};

export const config = {
  symbol: SYMBOL_RVN,
  endpoint: Config.RVN_NODE_ENDPOINT,
  network: RavencoinNetworks[getNetworkForCoin(SYMBOL_RVN)],
  coinPath: Config.RVN_COINPATH,
};

export default class RvnWallet extends BtcWallet {
  constructor(isMnemonic, initializer, additionalInfo) {
    let configOverride = { ...config }; // eslint-disable-line immutable/no-let

    if (additionalInfo && additionalInfo.useBtcDerivationPath) {
      configOverride = {
        ...configOverride,
        coinPath: Config.BTC_COINPATH,
      };
    }

    super(isMnemonic, initializer, { configOverride });
  }

  shouldUpgradeResult = null;
  shouldUpgrade = async () => {
    if (this.shouldUpgradeResult === null) {
      if (this.config.coinPath === Config.BTC_COINPATH) {
        this.shouldUpgradeResult = true; // eslint-disable-line immutable/no-mutation
        return true;
      }

      this.shouldUpgradeResult = false; // eslint-disable-line immutable/no-mutation
      return false;
    }

    return this.shouldUpgradeResult;
  };

  hasPromptedUpgradeModal = false;
  getUpgradeNotificationFlow = () => {
    if (
      this.config.coinPath === Config.BTC_COINPATH &&
      !this.hasPromptedUpgradeModal
    ) {
      return NOTIFICATION_FLOW_TYPE_UPGRADE_BAD_RVN_DERIVATION_PATH;
    }

    return null;
  };

  version = 0;
}
