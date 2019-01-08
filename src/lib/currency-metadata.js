import Config from 'react-native-config';
// bip39 is needed to be able to import Validator without errors, due to nodejs shimming
import bip39 from 'react-native-bip39';
import Validator from 'wallet-address-validator';

export function getCoinMetadata(symbol) {
  switch (symbol) {
    case 'LTC':
      return {
        image: require('assets/ltc_logo.png'),
        fullName: 'Litecoin',
      };
    case 'DASH':
      return {
        image: require('assets/dash_logo.png'),
        fullName: 'Dash',
      };
    case 'XRP':
      return {
        image: require('assets/ripple_logo.png'),
        fullName: 'Ripple',
      };
    case 'RVN':
      return {
        icon: require('assets/ravencoin_logo.png'),
        image: require('assets/ravencoin.png'),
        colors: ['#0c00ed', '#080092'],
        fullName: 'Ravencoin',
      };
    case 'BTC':
      return {
        image: require('assets/btc_logo.png'),
        icon: require('assets/btc_icon.png'),
        colors: ['#F2A900', '#BD8401'],
        fullName: 'Bitcoin',
      };
    case 'ETH':
      return {
        image: require('assets/eth_logo.png'),
        icon: require('assets/eth_icon.png'),
        colors: ['#C99D66', '#99774D'],
        fullName: 'Ethereum',
      };
    case 'BOAR':
      return {
        image: require('assets/boar_logo.png'),
        icon: require('assets/boar_icon.png'),
        colors: ['#E5129A', '#AA0D72'],
        fullName: 'BefOAR',
      };
    default:
      return {
        image: null,
        fullName: '',
      };
  }
}

export function getNetworkForCoin(symbol) {
  if (Config.CURRENCY_NETWORK_TYPE === 'main') {
    switch (symbol) {
      case 'ETH':
      case 'BOAR': {
        return 'homestead';
      }
      case 'BTC':
      case 'RVN':
      case 'LTC': {
        return 'mainnet';
      }
      default:
        return 'test';
    }
  } else {
    switch (symbol) {
      case 'ETH':
      case 'BOAR': {
        return 'rinkeby';
      }
      case 'BTC':
      case 'RVN':
      case 'LTC': {
        return 'testnet';
      }
      default:
        return 'test';
    }
  }
}

export function getInfoUrl(symbol, hash) {
  if (Config.CURRENCY_NETWORK_TYPE === 'main') {
    switch (symbol) {
      case 'ETH':
      case 'BOAR': {
        return `https://etherscan.io/tx/${hash}`;
      }
      case 'BTC':
        return `https://live.blockcypher.com/btc/tx/${hash}`;
      case 'RVN': {
        return `https://ravencoin.network/tx/${hash}`;
      }
      default:
        return '';
    }
  } else {
    switch (symbol) {
      case 'ETH':
      case 'BOAR': {
        return `https://rinkeby.etherscan.io/tx/${hash}`;
      }
      case 'BTC': {
        return `https://live.blockcypher.com/btc-testnet/tx/${hash}`;
      }
      case 'RVN': {
        return `https://testnet.ravencoin.network/tx/${hash}`;
      }
      default:
        return 'test';
    }
  }
}

export function validateAddress(symbol, address) {
  const network = Config.CURRENCY_NETWORK_TYPE === 'main' ? 'prod' : 'testnet';

  switch (symbol) {
    case 'BOAR': {
      return Validator.validate(address, 'ETH', network);
    }
    default: {
      return Validator.validate(address, symbol, network);
    }
  }
}
