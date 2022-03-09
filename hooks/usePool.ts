import { MsgExecuteContract } from "@terra-money/terra.js";
import {
  useWallet,
  useConnectedWallet,
  CreateTxFailed,
  Timeout,
  TxFailed,
  TxResult,
  TxUnspecifiedError,
  UserDenied,
} from "@terra-money/wallet-provider";
import BigNumber from "bignumber.js";

import { useLCDClient } from "hooks/";

import { getContractQuery, getBalance, postMessage } from "utils/wasm";
import { addresses } from "utils/constants";
import { compare } from "utils/number";

const usePool = () => {
  const { network } = useWallet();
  const connectedWallet = useConnectedWallet();
  const lcd = useLCDClient();

  const fetchPoolValues = async () => {
    // Get User Balance
    let res = await getBalance(
      addresses[network.chainID].contracts.kallistoPool.address,
      connectedWallet.walletAddress,
      network.chainID
    );
    const myLiquidity = new BigNumber(res["balance"]);

    // Get Total Liquidity
    res = await getContractQuery(
      addresses[network.chainID].contracts.kallistoPool.address,
      network.chainID,
      {
        total_cap: {},
      }
    );
    const totalLiquidity = new BigNumber(res["total_cap"]);

    // Get PoolInfo
    res = await getContractQuery(
      addresses[network.chainID].contracts.kallistoPool.address,
      network.chainID,
      {
        get_info: {},
      }
    );
    const totalSupply = new BigNumber(res["total_supply"]);
    const poolShare =
      compare(totalSupply, 0) === 0
        ? new BigNumber(0)
        : myLiquidity.dividedBy(totalSupply).multipliedBy(100);

    return {
      myLiquidity,
      totalLiquidity,
      totalSupply,
      poolShare,
    };
  };

  const deposit = (amount, callback) => {
    if (!connectedWallet || !network) {
      return;
    }

    const msg = new MsgExecuteContract(
      connectedWallet.walletAddress,
      addresses[network.chainID].contracts.kallistoPool.address,
      {
        deposit: {},
      },
      { uusd: amount }
    );

    postMessage(connectedWallet, msg, callback);
  };

  const withdrawUst = (amount, callback) => {
    if (!connectedWallet || !network) {
      return;
    }

    const msg = new MsgExecuteContract(
      connectedWallet.walletAddress,
      addresses[network.chainID].contracts.kallistoPool.address,
      {
        withdraw_ust: {
          share: amount.toString(),
        },
      }
    );

    postMessage(connectedWallet, msg, callback);
  };

  const getVolumeHistory = () => {
    
  }

  return {
    fetchPoolValues,
    deposit,
    withdrawUst,
    getVolumeHistory,
  };
};

export default usePool;
