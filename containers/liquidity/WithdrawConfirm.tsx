import React, { useState, useEffect, useMemo } from "react";
import BigNumber from "bignumber.js";

import ViewContainer from "components/ViewContainer";
import AmountView from "components/AmountView";
import WithdrawAmountInput from "components/WithdrawAmountInput";
import LiquidityButton from "components/LiquidityButton";

import { formatBalance } from "utils/wasm";
import { isNaN, compare } from "utils/number";
import { COLLECT_TYPE, LIQUIDITY_BALANCE_STATUS } from "types";

import cn from "classnames";

const WithdrawConfirm = ({
  onBack,
  totalAvailableBalance,
  withdrawAmount,
  onChangeWithdrawAmount,
  onConfirmWithdraw,
  loading
}) => {
  const [collectType, setCollectType] = useState<COLLECT_TYPE>("UST");

  const liquidityButtonStatus = useMemo((): LIQUIDITY_BALANCE_STATUS => {
    if (isNaN(withdrawAmount.value)) {
      return {
        status: "enter_amount",
        text: "Enter an amount",
      };
    }

    if (compare(withdrawAmount.value, 0) === 0) {
      return {
        status: "enter_amount",
        text: "Enter an amount",
      };
    }

    if (compare(withdrawAmount.value, totalAvailableBalance) === 1) {
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
        <div className="view-container-subtitle">Available balance<img src="/assets/question.png" style={{ marginLeft: 5, height: 16, cursor: 'pointer' }} /></div>
      </div>
      <div className="view-container-row">
        <AmountView
          icon="/assets/tokens/ust.png"
          value={`${formatBalance(totalAvailableBalance, 2)} UST`}
          iconBack={true}
          containerStyle={{
            height: 91,
            borderRadius: 100
          }}
        />
      </div>
      {/* <div className="view-container-row">
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
      </div> */}

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
        onClick={() => {
          if (loading) return;
          onConfirmWithdraw(collectType)
        }}
        label={loading ? "Withdrawing" : liquidityButtonStatus.text}
        status={loading ? "enter_amount" : liquidityButtonStatus.status}
      />
    </ViewContainer>
  );
};

export default WithdrawConfirm;
