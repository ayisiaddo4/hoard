import { ethers } from 'ethers';

import { SYMBOL_ETH } from 'containers/App/constants';
import { bigNumberToEther } from 'lib/formatters';
import { getNetworkForCoin } from 'lib/currency-metadata';

const network = getNetworkForCoin(SYMBOL_ETH); // Ex: <Project Root>/.env.test
const provider = ethers.getDefaultProvider(network);

if (__DEV__) {
  console.log(network, provider); //eslint-disable-line no-console
}

export default class EthWallet {
  constructor(isMnemonic, mnemonicOrPrivateKey) {
    let wallet; // eslint-disable-line immutable/no-let
    if (isMnemonic) {
      wallet = ethers.Wallet.fromMnemonic(mnemonicOrPrivateKey);
    } else if (!isMnemonic && mnemonicOrPrivateKey) {
      wallet = new ethers.Wallet(mnemonicOrPrivateKey);
    } else {
      wallet = new ethers.Wallet.createRandom();
    }

    this._wallet = wallet.connect(provider); // eslint-disable-line immutable/no-mutation
  }

  version = 0;

  symbol = SYMBOL_ETH;

  shouldUpgrade = () => false;
  getUpgradeNotificationFlow = () => null;

  getBalance = async () => {
    const balance = await this._wallet.getBalance();
    return bigNumberToEther(balance);
  };

  getPublicAddress = async () => {
    return this._wallet.getAddress();
  };

  getPrivateKey = async () => {
    return this._wallet.privateKey;
  };

  send = async (amount, toAddress) => {
    const amountInWei = ethers.utils.parseEther(amount.toString());
    const result = await this._wallet.sendTransaction({
      to: toAddress,
      value: amountInWei,
    });

    return result.hash;
  };
}
