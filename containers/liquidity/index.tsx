import React, { useState, useEffect } from "react";
import BigNumber from "bignumber.js";
import { useConnectedWallet, useWallet } from "@terra-money/wallet-provider";

import YourLiquidityPanel from "./YourLiquidityPanel";
import DepositPool from "./DepositPool";
import DepositConfirm from "./DepositConfirm";
import WithdrawConfirm from "./WithdrawConfirm";
import Ukraine from "components/Ukraine";

import { useLCDClient, usePool } from "hooks";
import { formatBalance } from "utils/wasm";

const Liquidity = () => {
  const lcd = useLCDClient();
  const { network } = useWallet();
  const connectedWallet = useConnectedWallet();
  const {
    fetchPoolValues,
    deposit,
  } = usePool();

  const [ustBalance, setUstBalance] = useState("0");

  const [totalLiquidity, setTotalLiquidity] = useState(new BigNumber(0));
  const [totalSupply, setTotalSupply] = useState(new BigNumber(0));
  const [myLiquidity, setMyLiquidity] = useState(new BigNumber(0));
  const [poolShare, setPoolShare] = useState(new BigNumber(0));

  /**
   * Deposit
   */
  const [balance, setBalance] = useState("");
  const [depositLoading, setDepositLoading] = useState(false)
  const handleChangeDepositInputAmount = (value) => {
    setBalance(value);
  };

  const handleConfirmDeposit = async () => {
    setDepositLoading(true)
    deposit(new BigNumber(balance).multipliedBy(10 ** 6).toString(), async (result) => {
      console.log('*********** Deposit Transaction **************');
      // Update Balance and Pool data
      getPoolValues();
      getUSTBalance();

      console.log(result);
      setDepositLoading(false);
      setBalance("");
      setStep(0);

      
    })
  };

  /**
   * Withdraw
   */
  const [withdrawAmount, setWithdrawAmount] = useState(new BigNumber(0));
  const handleChangeWithdrawAmount = (value) => {
    setWithdrawAmount(value);
  };

  const getUSTBalance = async () => {
    if (connectedWallet && lcd) {
      lcd.bank.balance(connectedWallet.walletAddress).then(([coins]) => {
        setUstBalance(formatBalance(coins._coins.uusd.amount, 6));
      });
    } else {
      setUstBalance("0");
    }
  }

  const getPoolValues = async () => {
    if (connectedWallet && network) {
      const result = await fetchPoolValues();

      setTotalLiquidity(result.totalLiquidity)
      setMyLiquidity(result.myLiquidity)
      setPoolShare(result.poolShare);
      setTotalSupply(result.totalSupply);
    }
  }

  useEffect(() => {
    getUSTBalance();
    getPoolValues();
  }, [connectedWallet, lcd, network]);

  const [step, setStep] = useState(0);

  return (
    <div className="liquidity-container">
      {step === 0 && <Ukraine />}
      <div className="liquidity-wrapper">
        {step === 0 && (
          <>
            <YourLiquidityPanel
              myBalance={myLiquidity}
              totalLiquidity={totalLiquidity}
              poolShare={poolShare}
              onDeposit={() => setStep(1)}
              ustBalance={ustBalance}
              balance={balance}
              onWithdraw={() => setStep(2)}
            />
            <DepositPool
              onDeposit={() => setStep(1)}
              ustBalance={ustBalance}
              balance={balance}
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
            totalAvailableBalance={1000}
            withdrawAmount={withdrawAmount}
            onChangeWithdrawAmount={(value) =>
              handleChangeWithdrawAmount(value)
            }
          />
        )}
      </div>
    </div>
  );
};

export default Liquidity;
