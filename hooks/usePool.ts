import { useState, useEffect } from "react";
import {
  MsgSend,
  MsgExecuteContract,
  MnemonicKey,
  Coins,
  LCDClient,
  WasmAPI,
  Wallet,
  Fee,
} from "@terra-money/terra.js";
import {
  useWallet,
  WalletStatus,
  ConnectType,
  useConnectedWallet,
  CreateTxFailed,
  Timeout,
  TxFailed,
  TxResult,
  TxUnspecifiedError,
  UserDenied,
} from "@terra-money/wallet-provider";
import BigNumber from "bignumber.js";

import { formatBalance, getContractQuery, getBalance } from "utils/wasm";
import { addresses } from "utils/constants";
import { compare } from "utils/number";

const usePool = () => {
  const { network } = useWallet();
  const connectedWallet = useConnectedWallet();

  // const [txResult, setTxResult] = useState<TxResult | null>(null);
  // const [txError, setTxError] = useState<string | null>(null);

  const fetchPoolValues = async () => {
    console.log("******* fetching pool values ********");

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

  const deposit = async (amount, callback) => {
    // setTxResult(null);
    // setTxError(null);

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

    connectedWallet
      .post({
        // fee: new Fee(1000000, "200000uusd"),
        msgs: [msg],
      })
      .then((nextTxResult: TxResult) => {
        console.log(nextTxResult);
        setTimeout(() => {
          callback({
            status: "Success",
            msg: "Your transaction has been successfully completed",
            data: nextTxResult,
          });
        }, 5000);

        // setTxResult(nextTxResult);
      })
      .catch((error: unknown) => {
        if (error instanceof UserDenied) {
          // setTxError("User Denied");
          callback({
            status: "User Denied",
            msg: "User Denied",
            data: error,
          });
        } else if (error instanceof CreateTxFailed) {
          // setTxError("Create Tx Failed: " + error.message);
          callback({
            status: "Create Tx Failed",
            msg: "User Denied",
            data: error,
          });
        } else if (error instanceof TxFailed) {
          // setTxError("Tx Failed: " + error.message);
          callback({
            status: "Tx Failed",
            msg: "Tx Failed: " + error.message,
            data: error,
          });
        } else if (error instanceof Timeout) {
          // setTxError("Timeout");
          callback({
            status: "Timeout",
            msg: "Timeout",
            data: error,
          });
        } else if (error instanceof TxUnspecifiedError) {
          // setTxError("Unspecified Error: " + error.message);
          callback({
            status: "Unspecified Error",
            msg: "Unspecified Error: " + error.message,
            data: error,
          });
        } else {
          // setTxError(
          //   "Unknown Error: " +
          //     (error instanceof Error ? error.message : String(error))
          // );
          callback({
            status: "Unknown Error",
            msg:
              "Unknown Error: " +
              (error instanceof Error ? error.message : String(error)),
            data: error,
          });
        }
      });
  };

  const withdrawUst = (share, callback) => {};

  return {
    fetchPoolValues,
    deposit,
  };
};

export default usePool;
