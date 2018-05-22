import ethers from "ethers";
import EthWallet from "./EthWallet";
import { SYMBOL_BOAR } from "containers/App/constants";

export default class BoarWallet extends EthWallet {
  constructor(isMnemonic, mnemonicOrPrivateKey) {
    super(isMnemonic, mnemonicOrPrivateKey);
    this._contract = new ethers.Contract(
      "0x0d729b3e930521e95de0efbdcd573f4cdc697b82",
      abi,
      this._wallet
    );
  }

  symbol = SYMBOL_BOAR;

  getBalance = async () => {
    const address = await this.getPublicAddress();
    const result = await this._contract.functions.balanceOf(address);
    return result;
  };

  send = async (amount, toAddress) => {
    const fromAddress = await this.getPublicAddress();
    const response = this._contract.functions.transferFrom(
      fromAddress,
      toAddress,
      amount
    );
    return response;
  };
}

const abi = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address"
      },
      {
        name: "_value",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      {
        name: "success",
        type: "bool"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "_from",
        type: "address"
      },
      {
        name: "_to",
        type: "address"
      },
      {
        name: "_value",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "success",
        type: "bool"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "_spender",
        type: "address"
      },
      {
        name: "_value",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        name: "success",
        type: "bool"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address"
      },
      {
        name: "_spender",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      {
        name: "remaining",
        type: "uint256"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "_from",
        type: "address"
      },
      {
        indexed: true,
        name: "_to",
        type: "address"
      },
      {
        indexed: false,
        name: "_value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "_owner",
        type: "address"
      },
      {
        indexed: true,
        name: "_spender",
        type: "address"
      },
      {
        indexed: false,
        name: "_value",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    inputs: [
      {
        name: "_initialAmount",
        type: "uint256"
      },
      {
        name: "_tokenName",
        type: "string"
      },
      {
        name: "_decimalUnits",
        type: "uint8"
      },
      {
        name: "_tokenSymbol",
        type: "string"
      }
    ],
    payable: false,
    type: "constructor"
  },
  {
    constant: false,
    inputs: [
      {
        name: "_spender",
        type: "address"
      },
      {
        name: "_value",
        type: "uint256"
      },
      {
        name: "_extraData",
        type: "bytes"
      }
    ],
    name: "approveAndCall",
    outputs: [
      {
        name: "success",
        type: "bool"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "version",
    outputs: [
      {
        name: "",
        type: "string"
      }
    ],
    payable: false,
    type: "function"
  }
];
