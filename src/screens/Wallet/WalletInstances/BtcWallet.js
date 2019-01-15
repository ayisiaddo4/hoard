import bip39 from 'react-native-bip39';
import Bitcoin from 'bitcoinjs-lib';
import Config from 'react-native-config';

import { SYMBOL_BTC } from 'containers/App/constants';
import { getNetworkForCoin } from 'lib/currency-metadata';
import api from 'lib/api';

export const config = {
  endpoint: Config.BTC_NODE_ENDPOINT,
  network: Bitcoin.networks[getNetworkForCoin(SYMBOL_BTC)],
  coinPath: Config.BTC_COINPATH,
};

export default class BtcWallet {
  constructor(isMnemonic, initializer, configOverride = config) {
    if (isMnemonic) {
      // eslint-disable-next-line immutable/no-mutation
      this._wallet = Bitcoin.HDNode.fromSeedBuffer(
        bip39.mnemonicToSeed(initializer),
        configOverride.network
      );
    } else {
      // eslint-disable-next-line immutable/no-mutation
      this._wallet = Bitcoin.HDNode.fromBase58(
        initializer,
        configOverride.network
      );
    }
  }

  symbol = SYMBOL_BTC;
  config = config;

  _derivationPath = `m/44'/${this.config.coinPath}'/0'/0/0`;

  _getUtxos = async () => {
    const address = await this.getPublicAddress();
    const endpoint = `${this.config.endpoint}/addr/${address}/utxo`;
    const utxos = await api.get(endpoint);
    return utxos;
  };

  _broadcastTransaction = async rawtx => {
    const endpoint = `${this.config.endpoint}/tx/send`;
    return api.post(endpoint, { rawtx });
  };

  _estimateFee = async () => {
    const numBlocks = 2;
    const endpoint = `${
      this.config.endpoint
    }/utils/estimatefee?nbBlocks=${numBlocks}`;
    const feeResponse = await api.get(endpoint);
    return Number(feeResponse[numBlocks]);
  };

  _calculateTransactionSize = (numIn, numOut) => {
    return numIn * 180 + numOut * 34 + 10 + 1;
  };

  getBalance = async () => {
    try {
      const address = await this.getPublicAddress();
      const endpoint = `${this.config.endpoint}/addr/${address}/balance`;
      const balanceSatoshis = await api.get(endpoint);
      const balance = balanceSatoshis * 1e-8;
      return balance;
    } catch (e) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log(`error in ${this.symbol} balance fetching`, e);
      }
      return 0;
    }
  };

  getPublicAddress = async () => {
    return this._wallet.derivePath(this._derivationPath).getAddress();
  };

  getPrivateKey = async () => {
    return this._wallet.toBase58();
  };

  send = async (amount, toAddress) => {
    const amountSatoshis = Math.round(amount * 1e8);
    const tx = new Bitcoin.TransactionBuilder(this.config.network);

    const balance = await this.getBalance();
    const balanceSatoshis = Math.round(balance * 1e8);

    const feePerKilobyte = await this._estimateFee();
    const safeFee = feePerKilobyte >= 0 ? feePerKilobyte : 0.00001;
    const feeSatoshisPerKilobyte = Math.round(safeFee * 1e8);

    const address = await this.getPublicAddress();

    const utxos = await this._getUtxos();

    const transactionSize = this._calculateTransactionSize(utxos.length, 2);
    const fee = Math.ceil(
      feeSatoshisPerKilobyte * Math.ceil(transactionSize / 1024)
    );

    const change = balanceSatoshis - fee - amountSatoshis;

    utxos.map(utxo => tx.addInput(utxo.txid, utxo.vout));

    tx.addOutput(address, change);
    tx.addOutput(toAddress, amountSatoshis);

    utxos.map((_, idx) =>
      tx.sign(idx, this._wallet.derivePath(this._derivationPath).keyPair)
    );

    const builtTransaction = tx.build().toHex();

    const response = await this._broadcastTransaction(builtTransaction);

    return response;
  };
}
