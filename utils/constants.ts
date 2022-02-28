export const ZERO = '0x0000000000000000000000000000000000000000'
export const DEFAULT_NETWORK = 1

export const addresses = {
  mainnet: {
    endpoint: "https://lcd.terra.dev",
    contracts: {
      aUST: {
        address: "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu",
        icon: "https://whitelist.anchorprotocol.com/logo/aUST.png"
      },
      bLuna: {
        address: "terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp",
        icon: "https://whitelist.anchorprotocol.com/logo/bLUNA.png"
      },
      bETH: {
        address: "terra1dzhzukyezv0etz22ud940z7adyv7xgcjkahuun",
        icon: "https://whitelist.anchorprotocol.com/logo/bETH.png"
      }
    }
  },
  testnet: {}
};
