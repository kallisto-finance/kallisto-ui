import React, { useState, useEffect, useMemo } from "react";
import BigNumber from "bignumber.js";

import ViewContainer from "components/ViewContainer";
import WithdrawAmountInput from "components/WithdrawAmountInput";
import LiquidityButton from "components/LiquidityButton";

import { isNaN, compare } from "utils/number";
import { COLLECT_TYPE, LIQUIDITY_BALANCE_STATUS } from "types";

import cn from "classnames";

const WithdrawConfirm = ({
  onBack,
  totalAvailableBalance,
  withdrawAmount,
  onChangeWithdrawAmount,
}) => {
  const [collectType, setCollectType] = useState<COLLECT_TYPE>("bLUNA");

  const liquidityButtonStatus = useMemo((): LIQUIDITY_BALANCE_STATUS => {
    if (isNaN(withdrawAmount)) {
      return {
        status: "enter_amount",
        text: "Enter an amount",
      };
    }

    if (compare(withdrawAmount, 0) === 0) {
      return {
        status: "enter_amount",
        text: "Enter an amount",
      };
    }

    if (compare(withdrawAmount, totalAvailableBalance) === 1) {
      return {
        status: "insufficient",
        text: "Insufficient Liquidity",
      };
    }

    return {
      status: "success",
      text: "Confirm Withdraw",
    };
  }, [withdrawAmount, totalAvailableBalance]);

  return (
    <ViewContainer
      title="Confirm Withdrawal"
      navLeft={true}
      onLeft={() => onBack()}
    >
      <div className="view-container-row">
        <div className="view-container-subtitle">Collect as</div>
      </div>
      <div className="view-container-row">
        <div className="collect-select">
          <div
            className={cn("collect-item", {
              selected: collectType === "bLUNA",
            })}
            onClick={(e) => setCollectType("bLUNA")}
          >
            <img src="/assets/tokens/bLuna.png" />
            <span>bLUNA</span>
          </div>
          <div
            className={cn("collect-item", { selected: collectType === "UST" })}
            onClick={(e) => setCollectType("UST")}
          >
            <img src="/assets/tokens/ust.png" />
            <span>UST</span>
          </div>
        </div>
      </div>

      <div className="view-container-row">
        <div className="view-container-subtitle">Amount to withdraw</div>
      </div>

      <div className="view-container-row">
        <WithdrawAmountInput
          maxBalance={totalAvailableBalance}
          withdrawAmount={withdrawAmount}
          onChangeWithdrawAmount={(value) => onChangeWithdrawAmount(value)}
          collectType={collectType}
        />
      </div>

      <LiquidityButton
        className="view-container-button"
        onClick={() => {}}
        label={liquidityButtonStatus.text}
        status={liquidityButtonStatus.status}
      />
    </ViewContainer>
  );
};

export default WithdrawConfirm;
