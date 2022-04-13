import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import BigNumber from "bignumber.js";
import { useConnectedWallet, useWallet } from "@terra-money/wallet-provider";
import { toast } from "react-toastify";

import YourLiquidityPanel from "./YourLiquidityPanel";
import MyLiquidityPanel from "./MyLiquidityPanel";
import MainLiquidityPanel from "./MainLiquidityPanel";
import PoolListPanel from "./PoolListPanel";
import DepositPool from "./DepositPool";
import DepositConfirm from "./DepositConfirm";
import WithdrawConfirm from "./WithdrawConfirm";
import TransactionFeedbackToast from "components/TransactionFeedbackToast";
import { UkraineBanner } from "components/Banner";
import ConnectionMask from "components/ConnectionMask";

import { useLCDClient, usePool } from "hooks";
import { formatBalance } from "utils/wasm";
import { moveScrollToTop } from "utils/document";
import { delay } from "utils/date";

import mixpanel from "mixpanel-browser";
mixpanel.init("f5f9ce712e36f5677629c9059c20f3dc");

let valueLoadingProgressBarInterval = null;

const Liquidity = () => {
  const lcd = useLCDClient();
  const connectedWallet = useConnectedWallet();
  const {
    fetchPoolValues,
    deposit,
    withdrawUst,
    getPool7DayDeposits,
    getTxInfo,
    isTxSuccess,
  } = usePool();

  const [pools, setPools] = useState([]);
  const [bLunaPrice, setBLunaPrice] = useState({
    price: new BigNumber(0),
    increase: "",
  });

  const [selectedPoolId, setSelectedPoolId] = useState(0);
  const selectedPool = useMemo(() => {
    const findIndex = pools.findIndex((item) => item.id === selectedPoolId);

    if (findIndex >= 0) {
      return pools[findIndex];
    }

    return null;
  }, [selectedPoolId, pools]);

  // My UST Balance
  const [ustBalance, setUstBalance] = useState("");

  const [deposit7Days, setDeposit7Days] = useState([]);
  const selectedPool7DayDeposits = useMemo(() => {
    const findIndex = deposit7Days.findIndex((item) => item.id === selectedPoolId);

    if (findIndex >= 0) {
      return deposit7Days[findIndex].deposits;
    }

    return new BigNumber(0);
  }, [selectedPoolId, deposit7Days]);

  const [valueLoading, setValueLoading] = useState(false);
  const [valueProgress, setValueProgress] = useState(100);

  useEffect(() => {
    // console.log('dddddddddddddddddddddddddddddddddddddddddd')
    // if (valueProgress === 0) {
    //   clearInterval(valueLoadingProgressBarInterval);
    //   return;
    // };  

    // valueLoadingProgressBarInterval = setInterval(() => {
    //   let tempProgress = 0;

    //   if (valueLoading) {
    //     tempProgress = valueProgress > 60 ? 60 : valueProgress - 1;
    //   } else {
    //     tempProgress = valueProgress - 1;
    //   }

    //   if (tempProgress < 0) {
    //     tempProgress = 0;
    //   }

    //   setValueProgress(tempProgress);
    // }, 200);

    valueLoadingProgressBarInterval = setInterval(() => {
      setValueProgress((prev) => {
        if (prev === 0) {
          clearInterval(valueLoadingProgressBarInterval);
          return 0;
        }

        if (!valueLoading && prev === 60) {
          return 60;
        }

        return prev - 0.5;
      });
    }, 10)
  }, [valueLoading]);

  /**
   * Deposit
   */
  const [balance, setBalance] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const handleChangeDepositInputAmount = (value) => {
    setBalance(value);
  };

  const handleConfirmDeposit = async () => {
    // toast(
    //   <TransactionFeedbackToast
    //     status="error"
    //     msg="test"
    //     hash="A204B5DCF075D10EDEA843AA09CFA7FCC3B2D985F0535699E909786F6BF62622"
    //   />
    // );
    // return;
    setDepositLoading(true);
    deposit(
      selectedPool.address,
      new BigNumber(balance).multipliedBy(10 ** 6).toString(),
      async (result) => {
        let txHash = "";

        if (result.status === "Success") {
          console.log("*********** Deposit Transaction **************");

          txHash = result.data.result.txhash;

          let txInfo = null;
          let msg = "";
          let txState = "";

          while (true) {
            try {
              await delay(200);

              txInfo = await getTxInfo(txHash, lcd);
              txState = isTxSuccess(txInfo);
              if (txState === "success") {
                msg = `Succesfully Deposited ${balance} UST.`;

                mixpanel.track("COMPLETED_DEPOSIT", { balance: balance });
                mixpanel.people.set({ balance: balance });
                mixpanel.people.set({ "anchor-bluna-balance": balance });
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
            getPoolValues(addresses.contracts.vaultList, connectedWallet, lcd);
            get7daysDeposits();

            setBalance("");
            setStep(1);

            moveScrollToTop("#your-liquidity-panel");
          }

          toast(
            <TransactionFeedbackToast
              status={txState === "success" ? "success" : "error"}
              msg={msg}
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

        setDepositLoading(false);
      }
    );
  };

  /**
   * Withdraw
   */
  const [withdrawPercentage, setWithdrawPercentage] = useState(50);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const handleConfirmWithdraw = (collectType) => {
    console.log(collectType);
    if (collectType == "UST") {
      setWithdrawLoading(true);

      const withdrawAmount = selectedPool.userBalance.multipliedBy(withdrawPercentage).dividedBy(100);
      console.log('withdrawAmount', withdrawAmount.toString());

      withdrawUst(selectedPool.address, withdrawAmount, async (result) => {
        console.log("*********** Withdraw UST Transaction **************");

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
              txState = isTxSuccess(txInfo);
              if (txState === "success") {
                msg = `Succesfully Withdraw ${balance} UST.`;
                mixpanel.track("COMPLETED_WITHDRAW", {
                  balance: `-${balance}`,
                });
                mixpanel.people.set({ balance: `-${balance}` });
                mixpanel.people.set({ "anchor-bluna-balance": balance });
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
            getPoolValues(addresses.contracts.vaultList, connectedWallet, lcd);
            get7daysDeposits();

            setWithdrawPercentage(50);
            setStep(1);

            moveScrollToTop("#your-liquidity-panel");
          }

          toast(
            <TransactionFeedbackToast
              status="success"
              msg={`Succesfully Withdrawn ${withdrawAmount.toFixed(0)} UST `}
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
    }
  };

  const getPoolValues = async (poolList, connectedWallet, lcd) => {
    const result = await fetchPoolValues(poolList, connectedWallet, lcd);

    setPools([...result.poolList]);
    setUstBalance(formatBalance(result.userUSTBalance, 6));

    const bPrice = {
      price: new BigNumber(0),
      increase: "",
    };

    if (
      compare(result.bLunaPrice, 0) === 0 ||
      compare(bLunaPrice.price, 0) === 0
    ) {
      bPrice.increase = "";
    } else {
      const increase = bLunaPrice.price
        .minus(result.bLunaPrice)
        .dividedBy(bLunaPrice.price)
        .multipliedBy(100);
      bPrice.increase = compare(increase, 0) !== 0 ? increase.toFixed(2) : "";
    }

    bPrice.price = result.bLunaPrice;

    await delay(500);

    setBLunaPrice({ ...bPrice });
  };

  const get7daysDeposits = async () => {
    const res = await getPool7DayDeposits(addresses.contracts.vaultList);
    setDeposit7Days(res);
  };

  const getQueryParam = (url, param) => {
    // Expects a raw URL
    param = param.replace(/[[]/, "[").replace(/[]]/, "]");
    let regexS = "[?&]" + param + "=([^&#]*)",
      regex = new RegExp(regexS),
      results = regex.exec(url);
    if (
      results === null ||
      (results && typeof results[1] !== "string" && results[1]["length"])
    ) {
      return "";
    } else {
      return decodeURIComponent(results[1]).replace(/\W/gi, " ");
    }
  };

  const getCampaignParams = async () => {
    let campaign_keywords =
        "utm_source utm_medium utm_campaign utm_content utm_term".split(" "),
      kw = "",
      params = {},
      first_params = {},
      index;
    const router = useRouter();
    //console.log(router.asPath)

    for (index = 0; index < campaign_keywords.length; ++index) {
      kw = getQueryParam(router.asPath, campaign_keywords[index]);
      if (kw.length) {
        params[campaign_keywords[index] + " [last touch]"] = kw;
      }
    }
    for (index = 0; index < campaign_keywords.length; ++index) {
      kw = getQueryParam(router.asPath, campaign_keywords[index]);
      if (kw.length) {
        first_params[campaign_keywords[index] + " [first touch]"] = kw;
      }
    }

    mixpanel.people.set(params);
    mixpanel.people.set_once(first_params);
    mixpanel.register(params);
  };

  /**
   * Init
   */
  getCampaignParams();
  useEffect(() => {
    // Initial
    getPoolValues(addresses.contracts.vaultList, connectedWallet, lcd);
    get7daysDeposits();

    let interval = null;

    interval = setInterval(() => {
      getPoolValues(addresses.contracts.vaultList, connectedWallet, lcd);
    }, 10000);

    return () => clearInterval(interval);
  }, [connectedWallet, lcd]);

  const [step, setStep] = useState(0);

  return (
    <div className="liquidity-container">
      <div className="liquidity-wrapper">
        {step === 0 && (
          <>
            <div className="liquidity-wrapper-general">
              <MainLiquidityPanel pools={pools} bLunaPrice={bLunaPrice} />
            </div>
            <div className="liquidity-wrapper-poolist">
              <PoolListPanel
                pools={pools}
                deposits={deposit7Days}
                onSelectPool={(id) => {
                  setSelectedPoolId(id);
                  setStep(1);
                }}
              />
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <div
              className="liquidity-wrapper-general"
              style={{ background: "none" }}
            >
              <MyLiquidityPanel
                pool={selectedPool}
                bLunaPrice={bLunaPrice}
                onBackToPools={() => {
                  setSelectedPoolId(0);
                  setStep(0);
                }}
                onWithdraw={() => {
                  moveScrollToTop();
                  setStep(3);
                }}
              />
            </div>
            <div className="liquidity-wrapper-deposit">
              <DepositPool
                pool={selectedPool}
                onDeposit={() => {
                  moveScrollToTop();
                  setStep(2);
                }}
                ustBalance={ustBalance}
                balance={balance}
                volume={selectedPool7DayDeposits}
                onChangeDepositInputAmount={(value) =>
                  handleChangeDepositInputAmount(value)
                }
              />
            </div>
          </>
        )}
        {step === 2 && (
          <div className="liquidity-wrapper-deposit" style={{ marginLeft: 0 }}>
            <DepositConfirm
              pool={selectedPool}
              onBack={() => setStep(1)}
              balance={balance}
              onConfirmDeposit={() => handleConfirmDeposit()}
              loading={depositLoading}
            />
          </div>
        )}
        {step === 3 && (
          <div className="liquidity-wrapper-deposit" style={{ marginLeft: 0 }}>
            <WithdrawConfirm
              pool={selectedPool}
              onBack={() => setStep(1)}
              withdrawAmount={withdrawAmount}
              onChangeWithdrawAmount={(value) =>
                handleChangeWithdrawAmount(value)
              }
              onConfirmWithdraw={(collectType) =>
                handleConfirmWithdraw(collectType)
              }
              loading={withdrawLoading}
            />{" "}
          </div>
        )}
      </div>
      {/* <UkraineBanner /> */}
    </div>
  );
};

export default Liquidity;
