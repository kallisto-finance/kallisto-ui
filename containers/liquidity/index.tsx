import React, { useState, useEffect } from "react";
import BigNumber from "bignumber.js";
import { useConnectedWallet } from "@terra-money/wallet-provider";

import DepositPool from "./DepositPool";
import DepositConfirm from "./DepositConfirm";

import { useLCDClient } from "hooks";

const Liquidity = () => {
  const lcd = useLCDClient();
  const connectedWallet = useConnectedWallet();

  const [ustBalance, setUstBalance] = useState("0");

  const [balance, setBalance] = useState();
  const handleChangeDepositInputAmount = (value) => {
    setBalance(value);
  };

  useEffect(() => {
    if (connectedWallet && lcd) {
      lcd.bank.balance(connectedWallet.walletAddress).then(([coins]) => {
        setUstBalance(
          new BigNumber(coins._coins.uusd.amount).div(10 ** 6).toString()
        );
      });
    } else {
      setUstBalance("0");
    }
  }, [connectedWallet, lcd]);

  const [step, setStep] = useState(0);

  return (
    <>
      {step === 0 && (
        <DepositPool
          onDeposit={() => setStep(1)}
          ustBalance={ustBalance}
          balance={balance}
          onChangeDepositInputAmount={(value) =>
            handleChangeDepositInputAmount(value)
          }
        />
      )}
      {step === 1 && <DepositConfirm onBack={() => setStep(0)} balance={balance} />}
    </>
  );
};

export default Liquidity;
