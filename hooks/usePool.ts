import { MsgExecuteContract, TxAPI } from "@terra-money/terra.js";
import {
  useWallet,
  useConnectedWallet,
} from "@terra-money/wallet-provider";
import BigNumber from "bignumber.js";

import { useLCDClient } from "hooks";

import { getContractQuery, getBalance, postMessage } from "utils/wasm";
import { addresses } from "utils/constants";
import { compare } from "utils/number";
import { getTxHistories } from "utils/axios";

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

  const getVolumeHistory = async (days = 7) => {
    let volume = new BigNumber(0);

    if (!network) {
      return volume;
    }

    const contractAddress =
      addresses[network.chainID].contracts.kallistoPool.address;

    const currentTime = new Date().getTime();
    const searchDateTime = currentTime - days * 86400 * 1000;
    const searchDateStartTime =
      searchDateTime - (searchDateTime % (86400 * 1000)); // 7 days ago 12:00:00 am

    const response = await getTxHistories(contractAddress);
    if (response.status === 200) {
      const txHistories = response.data;

      for (let i = 0; i < txHistories.txs.length; i++) {
        const tx = txHistories.txs[i];

        const txTimestamp = new Date(tx.timestamp).getTime();
        if (txTimestamp < searchDateStartTime) {
          continue;
        }

        if (tx.logs.length === 0) {
          continue;
        }

        const msgs = tx.tx.value.msg;

        for (let j = 0; j < msgs.length; j++) {
          const type = msgs[j].type;
          if (type !== "wasm/MsgExecuteContract") {
            continue;
          }

          const coins = msgs[j].value.coins;
          const msgValue = msgs[j].value.execute_msg;

          if ("deposit" in msgValue) {
            for (let k = 0; k < coins.length; k++) {
              if (coins[k].denom === "uusd") {
                volume = volume.plus(coins[k].amount);
              }
            }
          }

          if ("withdraw_ust" in msgValue) {
            volume = volume.plus(msgValue["withdraw_ust"].share);
          }
        }
      }
    }

    return volume;
  };

  const getTxInfo = async (txHash) => {
    const txAPI = new TxAPI(lcd);
    const txInfo  = await txAPI.txInfo(txHash);
    return txInfo
  }

  return {
    fetchPoolValues,
    deposit,
    withdrawUst,
    getVolumeHistory,
    getTxInfo
  };
};

export default usePool;
