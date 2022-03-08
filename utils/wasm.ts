import BigNumber from "bignumber.js";
import { MsgSend, MnemonicKey, Coins, LCDClient, WasmAPI } from "@terra-money/terra.js";
import { APIRequester } from "@terra-money/terra.js/dist/client/lcd/APIRequester";

import { addresses } from  "utils/constants";

const formatBalance = (value, fixed = 3, decimals = 6) => {
  const balance = new BigNumber(value).div(10 ** decimals).toFormat(fixed).toString()

  return balance
}

const getBalance = async (contractAddress, userAddress, chainId) => {
  const wasm = new WasmAPI(new APIRequester(addresses[chainId].endpoint));

  const balance = await wasm.contractQuery(
    contractAddress,
    {
      balance: {
        address: userAddress
      }
    }
  );

  return balance
}

const getContractQuery = async (contractAddress, chainId, query) => {
  const wasm = new WasmAPI(new APIRequester(addresses[chainId].endpoint));

  const result = await wasm.contractQuery(contractAddress, {
    ...query
  });

  return result;
}

export { formatBalance, getBalance, getContractQuery };
