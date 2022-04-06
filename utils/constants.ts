export const ZERO = "0x0000000000000000000000000000000000000000";

export const DEFAULT_NETWORK = "columbus-5";

export const UKRAINE_WALLET = "terra16d52wwt6t79x3sd35rargp3y5es90m64t0fkzk";

export const WITHDRAW_LOCK_TIME = 3600 * 1000 * 1000 * 1000; // NANO SECONDS

export const addresses = {
  endpoint: "https://lcd.terra.dev",
  contracts: {
    aUST: {
      address: "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu",
      icon: "https://whitelist.anchorprotocol.com/logo/aUST.png",
    },
    bLuna: {
      address: "terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp",
      icon: "https://whitelist.anchorprotocol.com/logo/bLUNA.png",
    },
    bETH: {
      address: "terra1dzhzukyezv0etz22ud940z7adyv7xgcjkahuun",
      icon: "https://whitelist.anchorprotocol.com/logo/bETH.png",
    },
    kallistoPool: {
      // address: "terra1hqtsau586tmzwl6apmf5u6u0avlafeef6w0qpp",
      // address: "terra1xqwqt9q54lr89wm6dpt0gxrsy5pewhdh2yjnjg",
      //testing only contract:
      address: process.env.LIQUIDITY_CONTRACT,
    },
    oracle: {
      address: "terra1cgg6yef7qcdm070qftghfulaxmllgmvk77nc7t",
    },
  },
};
