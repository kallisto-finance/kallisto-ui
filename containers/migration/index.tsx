import React, { useState, useEffect } from "react";
import { useConnectedWallet } from "@terra-money/wallet-provider";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

import MigratePool from "components/MigratePool";
import { LoadingTriple } from "components/LoadingIcon";
import TransactionFeedbackToast from "components/TransactionFeedbackToast";

import { usePool, useLCDClient } from "hooks";

import { addresses } from "utils/constants";
import { compare } from "utils/number";
import { formatBalance } from "utils/wasm";
import { delay } from "utils/date";

import mixpanel from "mixpanel-browser";
mixpanel.init("f5f9ce712e36f5677629c9059c20f3dc");

const MigrationHome = () => {
  const lcd = useLCDClient();
  const connectedWallet = useConnectedWallet();
  const { fetchPoolValues, withdrawUst, getTxInfo, isTxSuccess } = usePool();

  const [pools, setPools] = useState([]);
  const [valueLoading, setValueLoading] = useState(false);

  const getPoolValues = async (poolList, connectedWallet, lcd) => {
    const result = await fetchPoolValues(poolList, connectedWallet, lcd);

    setPools([
      ...result.poolList.filter((item) => compare(item.userCap, 0) === 1),
    ]);
    setValueLoading(true);
  };

  useEffect(() => {
    getPoolValues(addresses.migrations.contracts, connectedWallet, lcd);
  }, [connectedWallet]);

  // Withdraw
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const handleWithdraw = (id) => {
    const findIndex = pools.findIndex((item) => item.id === id);
    if (findIndex < 0) {
      return;
    }

    const pool = pools[findIndex];

    setWithdrawLoading(true);

    withdrawUst(pool.address, pool.userBalance, async (result) => {
      let txHash = "";

      if (result.status === "Success") {
        let txInfo = null;
        let msg = "";
        let txState = "";

        txHash = result.data.result.txhash;

        while (true) {
          try {
            await delay(200);

            txInfo = await getTxInfo(txHash, lcd);
            console.log("withdrawTX", txInfo);
            txState = isTxSuccess(txInfo);
            if (txState === "success") {
              msg = `Succesfully Withdrawn.`;
              mixpanel.track("COMPLETED_WITHDRAW", {
                balance: `-${formatBalance(pool.userBalance)}`,
              });
              mixpanel.people.set({
                balance: `-${formatBalance(pool.userBalance)}`,
              });
              mixpanel.people.set({
                "anchor-bluna-balance": formatBalance(pool.userBalance),
              });
            } else {
              if (txState.includes("insufficient funds")) {
                msg =
                  "Error submitting the deposit. Insufficient funds for gas fees.";
              } else {
                msg = txState;
              }
            }
            break;
          } catch (e) {}
        }

        if (txState === "success") {
          // Update Balance and Pool data
          getPoolValues(addresses.migrations.contracts, connectedWallet, lcd);
        }

        toast(
          <TransactionFeedbackToast
            status="success"
            msg={`Succesfully Withdraw`}
            hash={txHash}
          />
        );
      } else {
        toast(
          <TransactionFeedbackToast
            status="error"
            msg={result.data.message}
            hash={txHash}
          />
        );
      }

      setWithdrawLoading(false);
    });
  };

  return (
    <div className="migration-container">
      <div className="migration-page-content">
        <div className="select-liquidity-arrow">
          <span>Select a Liquidation Pool</span>
          <FontAwesomeIcon icon={faArrowDown as IconProp} />
        </div>
        <div className="migration-pools-list">
          {valueLoading ? (
            <div className="pool-list-wrapper">
              {pools.map((pool, index) => (
                <MigratePool
                  pool={pool}
                  key={`migration-pool-${pool.name}`}
                  onWithdraw={(id) => handleWithdraw(id)}
                />
              ))}
            </div>
          ) : (
            <LoadingTriple
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: 234,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MigrationHome;
