import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import BigNumber from "bignumber.js";
import { useConnectedWallet, useWallet } from "@terra-money/wallet-provider";
import { toast } from "react-toastify";

import YourLiquidityPanel from "./YourLiquidityPanel";
import DepositPool from "./DepositPool";
import DepositConfirm from "./DepositConfirm";
import WithdrawConfirm from "./WithdrawConfirm";
import TransactionFeedbackToast from "components/TransactionFeedbackToast";
import { UkraineBanner } from "components/Banner";

import { useLCDClient, usePool } from "hooks";
import { formatBalance } from "utils/wasm";
import { moveScrollToTop } from "utils/document";
import { delay } from "utils/date";

import mixpanel from "mixpanel-browser";
mixpanel.init("f5f9ce712e36f5677629c9059c20f3dc");

let valueLoadingProgressBarInterval = null;

const Liquidity = () => {
  const lcd = useLCDClient();
  const { network } = useWallet();
  const connectedWallet = useConnectedWallet();
  const {
    fetchPoolValues,
    deposit,
    withdrawUst,
    getVolumeHistory,
    getTxInfo,
    isTxSuccess,
  } = usePool();

  const [ustBalance, setUstBalance] = useState("0");

  const [totalLiquidity, setTotalLiquidity] = useState(new BigNumber(0));
  const [totalSupply, setTotalSupply] = useState(new BigNumber(0));
  const [myLiquidity, setMyLiquidity] = useState(new BigNumber(0));
  const [myCap, setMyCap] = useState(new BigNumber(0));
  const [poolShare, setPoolShare] = useState(new BigNumber(0));
  const [lastDepositTime, setLastDepositTime] = useState(0);
  const [donutValues, setDonutValues] = useState(null);

  const [volume7Days, setVolume7Days] = useState(new BigNumber(0));

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
            getPoolValues(lcd);
            getUSTBalance();
            get7daysVolume();

            setBalance("");
            setStep(0);

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
      const withdrawAmount = myLiquidity
        .multipliedBy(withdrawPercentage)
        .dividedBy(100);
      console.log("withdrawAmount", withdrawAmount.toString());
      withdrawUst(withdrawAmount, async (result) => {
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
            getPoolValues(lcd);
            getUSTBalance();
            get7daysVolume();

            setWithdrawPercentage(50);
            setStep(0);

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

  /**
   * Fetch values
   */
  const getUSTBalance = async () => {
    if (connectedWallet && lcd) {
      lcd.bank.balance(connectedWallet.walletAddress).then(([coins]) => {
        const ustBalance =
          "uusd" in coins._coins ? coins._coins.uusd.amount : 0;
        setUstBalance(formatBalance(ustBalance, 6));
        setValueLoading(true);
      });
    } else {
      setUstBalance("0");
    }
  };

  const getPoolValues = async (lcd) => {
    const result = await fetchPoolValues(lcd);

    setValueLoading(true);

    setTotalLiquidity(result.totalLiquidity);
    setMyLiquidity(result.myLiquidity);
    setPoolShare(result.poolShare);
    setTotalSupply(result.totalSupply);
    setLastDepositTime(result.lastDepositTime);
    setMyCap(result.myDeposited);
    setDonutValues(result.donutData);
  };

  const get7daysVolume = async () => {
    const volume = await getVolumeHistory();
    setVolume7Days(volume);
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
    getUSTBalance();
    getPoolValues(lcd);
    get7daysVolume();

    let interval = null;

    interval = setInterval(() => {
      getUSTBalance();
      getPoolValues(lcd);
    }, 10000);

    return () => clearInterval(interval);
  }, [connectedWallet, lcd, network]);

  // useEffect(() => {
  //   let interval = null;

  //   interval = setInterval(() => {
  //     get7daysVolume();
  //   }, 10000);

  //   return () => clearInterval(interval);
  // }, []);

  const [step, setStep] = useState(0);

  return (
    <div className="liquidity-container">
      {/* {step === 0 && (
        <div className="banner-wrapper">
          <DeFiBanner />
        </div>
      )} */}
      <div className="liquidity-wrapper">
        {step === 0 && (
          <>
            <YourLiquidityPanel
              myBalance={myLiquidity}
              myCap={myCap}
              totalLiquidity={totalLiquidity}
              poolShare={poolShare}
              lastDepositTime={lastDepositTime}
              donutValues={donutValues}
              progress={valueProgress}
              onWithdraw={() => {
                moveScrollToTop();
                setStep(2);
              }}
            />
            <DepositPool
              onDeposit={() => {
                moveScrollToTop();
                setStep(1);
                mixpanel.track("DEPOSIT");
              }}
              ustBalance={ustBalance}
              balance={balance}
              volume={volume7Days}
              totalLiquidity={totalLiquidity}
              onChangeDepositInputAmount={(value) =>
                handleChangeDepositInputAmount(value)
              }
            />
          </>
        )}
        {step === 1 && (
          <DepositConfirm
            myBalance={myLiquidity}
            totalSupply={totalSupply}
            onBack={() => setStep(0)}
            balance={balance}
            onConfirmDeposit={() => handleConfirmDeposit()}
            loading={depositLoading}
          />
        )}
        {step === 2 && (
          <WithdrawConfirm
            onBack={() => setStep(0)}
            myCap={myCap}
            withdrawPercentage={withdrawPercentage}
            onChangeWithdrawPercentage={(value) => {
              setWithdrawPercentage(value);
            }}
            onConfirmWithdraw={(collectType) =>
              handleConfirmWithdraw(collectType)
            }
            loading={withdrawLoading}
          />
        )}
      </div>
      <UkraineBanner />
    </div>
  );
};

export default Liquidity;
