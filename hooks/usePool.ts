import { MsgExecuteContract, TxAPI } from "@terra-money/terra.js";
import { useWallet, useConnectedWallet } from "@terra-money/wallet-provider";
import BigNumber from "bignumber.js";

import { useLCDClient } from "hooks";

import { getContractQuery, getBalance, postMessage } from "utils/wasm";
import { addresses, UKRAINE_WALLET } from "utils/constants";
import { compare } from "utils/number";
import { getTxHistories } from "utils/axios";
import { delay } from "utils/date";

const usePool = () => {
  const { network } = useWallet();
  const connectedWallet = useConnectedWallet();
  const lcd = useLCDClient();

  const fetchPoolValues = async () => {
    // Get User Balance
    let res = connectedWallet
      ? await getBalance(
          addresses.contracts.kallistoPool.address,
          connectedWallet.walletAddress
        )
      : { balance: 0 };
    const myLiquidity = new BigNumber(res["balance"]);

    // Get Total Liquidity
    res = await getContractQuery(addresses.contracts.kallistoPool.address, {
      total_cap: {},
    });
    const totalLiquidity = new BigNumber(res["total_cap"]);

    // Get PoolInfo
    res = await getContractQuery(addresses.contracts.kallistoPool.address, {
      get_info: {},
    });
    const totalSupply = new BigNumber(res["total_supply"]);
    const poolShare =
      compare(totalSupply, 0) === 0
        ? new BigNumber(0)
        : myLiquidity.dividedBy(totalSupply).multipliedBy(100);

    // Get Last Deposit Time
    res = connectedWallet
      ? await getContractQuery(addresses.contracts.kallistoPool.address, {
          last_deposit_timestamp: {
            address: connectedWallet.walletAddress,
          },
        })
      : { timestamp: 0 };
    const lastDepositTime = res["timestamp"];

    // My Cap in UST
    const myDeposited = myLiquidity
      .dividedBy(totalSupply)
      .multipliedBy(totalLiquidity);

    /**
     * Get donut values: [UST in Liquidity], [UST in Bids], [UST in bLuna]
     * [Total Cap] = [UST in Liquidity] + [UST in Bids] + [UST in bLuna]
     */
    // Get bLuna balance
    res = await getBalance(
      addresses.contracts.bLuna.address,
      addresses.contracts.kallistoPool.address
    );
    const bLunaBalance = new BigNumber(res["balance"]);

    // get bLuna Price
    res = await getContractQuery(addresses.contracts.oracle.address, {
      price: {
        base: addresses.contracts.bLuna.address,
        quote: "uusd",
      },
    });
    const price = new BigNumber(res["rate"]);
    const bLunaBalanceForUST = bLunaBalance.multipliedBy(price);

    // get Vault UST price
    const vaultBank =
      lcd !== null
        ? await lcd.bank.balance(addresses.contracts.kallistoPool.address)
        : [{ _coins: {} }];

    const ustBalance =
      "uusd" in vaultBank[0]._coins ? vaultBank[0]._coins.uusd.amount : 0;

    const donutUST = new BigNumber(ustBalance)
      .multipliedBy(poolShare)
      .dividedBy(100);
    const donutBLuna = bLunaBalance.multipliedBy(poolShare).dividedBy(100);
    const donutBLunaForUST = bLunaBalanceForUST
      .multipliedBy(poolShare)
      .dividedBy(100);
    const donutUSTBid = myDeposited.minus(donutUST).minus(donutBLunaForUST);

    const donutData = {
      ust: donutUST,
      bluna: donutBLuna,
      blunaUST: donutBLunaForUST,
      ustBid: donutUSTBid,
    };
    /** ------------------------------------------------------------------------------------- */

    return {
      myLiquidity: myLiquidity,
      myDeposited,
      totalLiquidity,
      totalSupply,
      poolShare,
      donutData,
      lastDepositTime,
    };
  };

  const deposit = (amount, callback) => {
    if (!connectedWallet || !network) {
      return;
    }

    console.log(addresses.contracts.kallistoPool.address);
    const msg = new MsgExecuteContract(
      connectedWallet.walletAddress,
      addresses.contracts.kallistoPool.address,
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
      addresses.contracts.kallistoPool.address,
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

    const contractAddress = addresses.contracts.kallistoPool.address;

    const currentTime = new Date().getTime();
    const searchDateTime = currentTime - days * 86400 * 1000;
    const searchDateStartTime =
      searchDateTime - (searchDateTime % (86400 * 1000)); // 7 days ago 12:00:00 am

    const historyData = [];

    let offset = 0;
    let limit = 100;

    try {
      while (true) {
        const txHistories = await getTxHistories(
          contractAddress,
          offset,
          limit
        );

        if (txHistories.txs.length === 0) {
          break;
        }

        for (let i = 0; i < txHistories.txs.length; i++) {
          const tx = txHistories.txs[i];

          const txTimestamp = new Date(tx.timestamp).getTime();

          if (txTimestamp < searchDateStartTime) {
            break;
          }

          historyData.push(tx);
        }

        if (!txHistories.next || txHistories.next === undefined) {
          break;
        }

        offset = txHistories.next;

        await delay(1000);
      }
    } catch (e) {}

    for (let i = 0; i < historyData.length; i++) {
      const tx = historyData[i];

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

    return volume;
  };

  const getUkraineDepositHistory = async () => {
    let weeklyRaised = new BigNumber(0);
    let totalRaised = new BigNumber(0);

    const historyData = [];

    let offset = 0;
    let limit = 100;

    let isWeekly = true;

    try {
      while (true) {
        const txHistories = await getTxHistories(UKRAINE_WALLET, offset, limit);

        if (txHistories.txs.length === 0) {
          break;
        }

        for (let i = 0; i < txHistories.txs.length; i++) {
          historyData.push(txHistories.txs[i]);
        }

        if (!txHistories.next || txHistories.next === undefined) {
          break;
        }

        offset = txHistories.next;

        await delay(1000);
      }
    } catch (e) {}

    for (let i = 0; i < historyData.length; i++) {
      const tx = historyData[i];

      if (tx.logs.length === 0) {
        continue;
      }

      const msgs = tx.tx.value.msg;

      for (let j = 0; j < msgs.length; j++) {
        const type = msgs[j].type;
        if (type !== "bank/MsgSend") {
          continue;
        }

        const toAddress = msgs[j].value.to_address;
        if (toAddress.toString() !== UKRAINE_WALLET.toString()) {
          continue;
        }

        const amounts = msgs[j].value.amount;

        for (let k = 0; k < amounts.length; k++) {
          if (amounts[k].denom === "uusd") {
            totalRaised = totalRaised.plus(amounts[k].amount);

            if (isWeekly) {
              weeklyRaised = weeklyRaised.plus(amounts[k].amount);
              isWeekly = false;
            }
          }
        }
      }
    }

    return {
      weeklyRaised,
      totalRaised,
    };
  };

  const getTxInfo = async (txHash) => {
    const txAPI = new TxAPI(lcd);
    const txInfo = await txAPI.txInfo(txHash);
    return txInfo;
  };

  const isTxSuccess = (txInfo) => {
    if (txInfo.logs.length === 0) {
      return txInfo.raw_log.toString();
    }

    return "success";
  };

  return {
    fetchPoolValues,
    deposit,
    withdrawUst,
    getVolumeHistory,
    getUkraineDepositHistory,
    getTxInfo,
    isTxSuccess,
  };
};

export default usePool;
