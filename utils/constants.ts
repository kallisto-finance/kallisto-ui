export const ZERO = "0x0000000000000000000000000000000000000000";

export const DEFAULT_NETWORK = "columbus-5";

export const UKRAINE_WALLET = "terra1zsm74pnpr508jy02zzxwhrc2gwg2tn87w9fgn9";

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
      address: process.env.LIQUIDITY_CONTRACT,
    },
    oracle: {
      address: "terra1cgg6yef7qcdm070qftghfulaxmllgmvk77nc7t",
    },
    vaultList: [
      {
        id: 1,
        apy: 0,
        name: "aUST/bLuna",
        category: "Kujira - Anchor",
        address: "",
        theme: "kujira",
        icon: "/assets/tokens/kujira.png"
      },
      {
        id: 2,
        apy: 3.58,
        name: "bLuna",
        category: "Anchor",
        address: process.env.LIQUIDITY_CONTRACT,
        theme: "default",
        icon: "/assets/tokens/bluna-anchor.png"
      }
    ]
  },
};
