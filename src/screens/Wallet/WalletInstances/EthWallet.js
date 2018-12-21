import ethers from 'ethers';
import Config from 'react-native-config';

import { SYMBOL_ETH } from 'containers/App/constants';
import { bigNumberToEther } from 'lib/formatters';
import { getNetworkForCoin } from 'lib/currency-metadata';

const network = getNetworkForCoin(SYMBOL_ETH); // Ex: <Project Root>/.env.test
const provider = ethers.providers.getDefaultProvider(network);

if (__DEV__) {
  console.log(network, provider); //eslint-disable-line no-console
}

export default class EthWallet {
  constructor(isMnemonic, mnemonicOrPrivateKey) {
    if (isMnemonic) {
      this._wallet = ethers.Wallet.fromMnemonic(mnemonicOrPrivateKey);
    } else if (!isMnemonic && mnemonicOrPrivateKey) {
      this._wallet = new ethers.Wallet(mnemonicOrPrivateKey);
    } else {
      this._wallet = new ethers.Wallet.createRandom();
    }

    this._wallet.provider = provider;
  }

  symbol = SYMBOL_ETH;

  listenForBalanceChange = callback =>
    this._wallet.provider.on(this._wallet.address, balance =>
      callback(bigNumberToEther(balance))
    );

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
    const result = await this._wallet.send(toAddress, amountInWei);

    return result.hash;
  };
}
