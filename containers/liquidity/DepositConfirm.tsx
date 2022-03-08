import React, { useState, useMemo } from "react";
import BigNumber from "bignumber.js";

import ViewContainer from "components/ViewContainer";
import Button from "components/Button";
import AmountView from "components/AmountView";

import { isNaN } from "utils/number";

import cn from "classnames";

const DepositConfirm = ({
  myBalance,
  totalSupply,
  onBack,
  balance,
  onConfirmDeposit,
  loading,
}) => {
  const expectedPoolShare = useMemo(() => {
    const expectedMyBalance = myBalance.plus(
      new BigNumber(isNaN(balance) ? 0 : balance).multipliedBy(10 ** 6)
    );
    const expectedTotalSupply = totalSupply.plus(
      new BigNumber(isNaN(balance) ? 0 : balance).multipliedBy(10 ** 6)
    );

    return expectedMyBalance.dividedBy(expectedTotalSupply).multipliedBy(100);
  }, [myBalance, totalSupply, balance]);

  return (
    <ViewContainer
      title="Confirm your Deposit"
      navLeft={true}
      onLeft={() => onBack()}
    >
      <div className="view-container-row">
        <div className="view-container-subtitle">Collateral Market</div>
      </div>

      <div className="view-container-row half">
        <AmountView value="bLuna" icon="/assets/tokens/bLuna.png" />
      </div>

      <div className="view-container-row">
        <div className="view-container-subtitle">Deposit amount</div>
      </div>
      <div className="view-container-row">
        <AmountView
          value={`${
            balance === "" ? 0 : new BigNumber(balance).toFormat()
          } UST`}
        />
      </div>

      <div className="view-container-row">
        <div className="view-container-subtitle">Your % of the Pool* </div>
        <div className="view-container-noticetitle">
          *This rate is dynamic.{" "}
        </div>
      </div>
      <div className="view-container-row">
        <AmountView value={`${expectedPoolShare.toFixed(2)} %`} />
      </div>

      <Button
        className={cn("view-container-button", { "enter-amount": loading })}
        onClick={(e) => {
          if (loading) return;
          onConfirmDeposit();
        }}
      >
        {loading ? "Depositing" : "Confirm Deposit"}
      </Button>
    </ViewContainer>
  );
};

export default DepositConfirm;
