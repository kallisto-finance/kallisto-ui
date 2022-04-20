import React, { useState, useMemo } from "react";

import ViewContainer from "components/ViewContainer";
import AmountView from "components/AmountView";
import WithdrawAmountInput from "components/WithdrawAmountInput";
import LiquidityButton from "components/LiquidityButton";
import { LoadingSpinner } from "components/LoadingIcon";

import { formatBalance } from "utils/wasm";
import { compare } from "utils/number";
import { COLLECT_TYPE, LIQUIDITY_BALANCE_STATUS } from "types";

import mixpanel from "mixpanel-browser";
mixpanel.init("f5f9ce712e36f5677629c9059c20f3dc");

const WithdrawConfirm = ({
  pool,
  onBack,
  withdrawPercentage,
  onChangeWithdrawPercentage,
  onConfirmWithdraw,
  loading,
}) => {
  const [collectType, setCollectType] = useState<COLLECT_TYPE>("UST");

  const liquidityButtonStatus = useMemo((): LIQUIDITY_BALANCE_STATUS => {
    if (compare(withdrawPercentage, 0) === 0) {
      return {
        status: "enter_amount",
        text: "Enter an amount",
      };
    }

    return {
      status: "success",
      text: "Confirm Withdraw",
    };
  }, [withdrawPercentage]);

  return (
    <ViewContainer
      title="Confirm Withdrawal"
      navLeft={true}
      onLeft={() => onBack()}
    >
      <div className="view-container-row">
        <div className="view-container-subtitle">Amount available</div>
      </div>
      <div className="view-container-row">
        <AmountView
          icon="/assets/tokens/ust.png"
          value={`${formatBalance(pool.userCap, 2)} UST`}
          iconBack={true}
          containerStyle={{
            height: 91,
            borderRadius: 100,
          }}
        />
      </div>
      <div className="view-container-row">
        <div className="view-container-subtitle">Amount to withdraw</div>
      </div>

      <div className="view-container-row">
        <WithdrawAmountInput
          myCap={pool.userCap}
          withdrawPercentage={withdrawPercentage}
          onChangeWithdrawPercentage={(value) =>
            onChangeWithdrawPercentage(value)
          }
          collectType={collectType}
        />
      </div>

      <LiquidityButton
        className="view-container-button"
        onClick={() => {
          if (loading) return;
          mixpanel.track("CONFIRM_WITHDRAWAL");
          onConfirmWithdraw(collectType);
        }}
        label={
          loading ? (
            <>
              <LoadingSpinner />
              Withdrawing UST
            </>
          ) : (
            liquidityButtonStatus.text
          )
        }
        status={loading ? "loading" : liquidityButtonStatus.status}
      />
    </ViewContainer>
  );
};

export default WithdrawConfirm;
