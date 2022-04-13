import React, { useState, useEffect } from "react";

import BigNumber from "bignumber.js";
import { useConnectedWallet, useWallet } from "@terra-money/wallet-provider";

import YourLiquidityPanel from "./YourLiquidityPanel";
import DepositPool from "./DepositPool";
import DepositConfirm from "./DepositConfirm";
import WithdrawConfirm from "./WithdrawConfirm";
import TransactionFeedbackToast from "components/TransactionFeedbackToast";
import { UkraineBanner } from "components/Banner";

import { useLCDClient, usePool } from "hooks";
import { formatBalance } from "utils/wasm";
import { isNaN } from "utils/number";
import { moveScrollToTop } from "utils/document";
import { delay } from "utils/date"
import { toast } from "react-toastify";
import mixpanel from "mixpanel-browser";
mixpanel.init("f5f9ce712e36f5677629c9059c20f3dc");
import {useRouter} from 'next/router';

const Liquidity = () => {
  const lcd = useLCDClient();
  const { network } = useWallet();
  const connectedWallet = useConnectedWallet();
  const { fetchPoolValues, deposit, withdrawUst, getVolumeHistory, getTxInfo, isTxSuccess } = usePool();

  const [ustBalance, setUstBalance] = useState("0");

  const [totalLiquidity, setTotalLiquidity] = useState(new BigNumber(0));
  const [totalSupply, setTotalSupply] = useState(new BigNumber(0));
  const [myLiquidity, setMyLiquidity] = useState(new BigNumber(0));
  const [myCap, setMyCap] = useState(new BigNumber(0));
  const [poolShare, setPoolShare] = useState(new BigNumber(0));
  const [lastDepositTime, setLastDepositTime] = useState(0);
  const [donutValues, setDonutValues ] = useState(null);

  const [volume7Days, setVolume7Days] = useState(new BigNumber(0));


  /**
   * Deposit
   */
  const [balance, setBalance] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const handleChangeDepositInputAmount = (value) => {
    setBalance(value);
  };

  const handleConfirmDeposit = async () => {
    setDepositLoading(true);
    deposit(
      new BigNumber(balance).multipliedBy(10 ** 6).toString(),
      async (result) => {
        if (result.status === "Success") {
          console.log("*********** Deposit Transaction **************");

          let txInfo = null;
          let msg = "";
          let txState = "";

          while (true) {
            try {
              await delay(200);

              txInfo = await getTxInfo(result.data.result.txhash, lcd);
              txState = isTxSuccess(txInfo);
              if (txState === "success") {
                msg = `Succesfully Deposited ${balance} UST.`;

                mixpanel.track("COMPLETED_DEPOSIT", { 'balance': balance});
                mixpanel.people.set({ 'balance': balance});
                mixpanel.people.set({ 'anchor-bluna-balance': balance });
              } else {
                if (txState.includes("insufficient funds"))  {
                  msg = "Error submitting the deposit. Insufficient funds for gas fees.";
                } else {
                  msg = txState;
                }
              }
              break;
            } catch (e) {
            }
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
            />
          );
        } else {
          toast(<TransactionFeedbackToast status="error" msg={result.data.message} />);
        }

        setDepositLoading(false);
      }
    );
  };

  /**
   * Withdraw
   */
  const [withdrawAmount, setWithdrawAmount] = useState({
    format: "",
    value: new BigNumber(0),
  });
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const handleChangeWithdrawAmount = (value) => {
    setWithdrawAmount({
      format: value,
      value: isNaN(value)
        ? new BigNumber(0)
        : new BigNumber(value).multipliedBy(10 ** 6),
    });
  };

  const handleConfirmWithdraw = (collectType) => {
    console.log(collectType);
    if (collectType == "UST") {
      setWithdrawLoading(true);
      withdrawUst(withdrawAmount.value, async (result) => {
        console.log("*********** Withdraw UST Transaction **************");
        console.log(result);

        if (result.status === "Success") {
          let txInfo = null;
          let msg = "";
          let txState = "";


          while (true) {
            try {
              await delay(200);

              txInfo = await getTxInfo(result.data.result.txhash, lcd);
              txState = isTxSuccess(txInfo);
              if (txState === "success") {
                msg = `Succesfully Withdraw ${balance} UST.`;
                mixpanel.track("COMPLETED_WITHDRAW", { 'balance': `-${balance}`});
                mixpanel.people.set({ 'balance':`-${balance}`});
                mixpanel.people.set({ 'anchor-bluna-balance': balance });
              } else {
                if (txState.includes("insufficient funds")) {
                  msg = "Error submitting the deposit. Insufficient funds for gas fees.";
                } else {
                  msg = txState;
                }
              }
              break;
            } catch (e) {
            }
          }

          if (txState === "success") {
            // Update Balance and Pool data
            getPoolValues(lcd);
            getUSTBalance();
            get7daysVolume();

            setWithdrawAmount({
              format: "0",
              value: new BigNumber(0),
            });
            setStep(0);

            moveScrollToTop("#your-liquidity-panel");
          }

          toast(
            <TransactionFeedbackToast
              status="success"
              msg={`Succesfully Withdrawn ${withdrawAmount.format} UST `}
            />
          );
        } else {
          toast(<TransactionFeedbackToast status="error" msg={result.data.message} />);
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
      });
    } else {
      setUstBalance("0");
    }
  };

  const getPoolValues = async (lcd) => {
    const result = await fetchPoolValues(lcd);

    setTotalLiquidity(result.totalLiquidity);
    setMyLiquidity(result.myLiquidity);
    setPoolShare(result.poolShare);
    setTotalSupply(result.totalSupply);
    setLastDepositTime(result.lastDepositTime);
    setMyCap(result.myDeposited);
    setDonutValues(result.donutData)
  };

  const get7daysVolume = async () => {
    const volume = await getVolumeHistory();
    setVolume7Days(volume);
  };

  const getQueryParam = (url, param) => {
    // Expects a raw URL
    param = param.replace(/[[]/, "\[").replace(/[]]/, "\]");
    let regexS = "[\?&]" + param + "=([^&#]*)",
      regex = new RegExp( regexS ),
      results = regex.exec(url);
    if (results === null || (results && typeof(results[1]) !== 'string' && results[1]['length'] )) {
      return '';
    } else {
      return decodeURIComponent(results[1]).replace(/\W/gi, ' ');
      }
    };

  const getCampaignParams = async () => {

    let campaign_keywords = 'utm_source utm_medium utm_campaign utm_content utm_term'.split(' ')
      , kw = ''
      , params = {}
      , first_params = {}
      , index;
    const router = useRouter()
    //console.log(router.asPath)

    for (index = 0; index < campaign_keywords.length; ++index) {
      kw = getQueryParam(router.asPath, campaign_keywords[index]);
      if (kw.length) {
        params[campaign_keywords[index] + ' [last touch]'] = kw;
      }
    }
    for (index = 0; index < campaign_keywords.length; ++index) {
      kw = getQueryParam(router.asPath, campaign_keywords[index]);
      if (kw.length) {
        first_params[campaign_keywords[index] + ' [first touch]'] = kw;
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
              onWithdraw={() => {
                moveScrollToTop();
                setStep(2);
              }}
            />
            <DepositPool
              onDeposit={() => {
                moveScrollToTop();
                setStep(1);
                mixpanel.track('DEPOSIT');
              }}
              ustBalance={ustBalance}
              balance={balance}
              volume={volume7Days}
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
            totalAvailableBalance={myLiquidity}
            withdrawAmount={withdrawAmount}
            onChangeWithdrawAmount={(value) =>
              handleChangeWithdrawAmount(value)
            }
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
