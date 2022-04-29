import React, { useState, useMemo } from "react";
import BigNumber from "bignumber.js";

import ViewContainer from "components/ViewContainer";
import Button from "components/Button";
import AmountView from "components/AmountView";
import { LoadingSpinner } from "components/LoadingIcon";

import { isNaN } from "utils/number";

import cn from "classnames";
import mixpanel from "mixpanel-browser";

mixpanel.init("f5f9ce712e36f5677629c9059c20f3dc");

const DepositConfirm = ({
  pool,
  onBack,
  balance,
  onConfirmDeposit,
  loading,
}) => {
  const expectedPoolShare = useMemo(() => {
    const expectedMyBalance = pool.userBalance.plus(
      new BigNumber(isNaN(balance) ? 0 : balance).multipliedBy(10 ** 6)
    );
    const expectedTotalSupply = pool.totalSupply.plus(
      new BigNumber(isNaN(balance) ? 0 : balance).multipliedBy(10 ** 6)
    );

    return expectedMyBalance.dividedBy(expectedTotalSupply).multipliedBy(100);
  }, [pool, balance]);

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
        <AmountView value="bLUNA" icon="/assets/tokens/bLuna.png" />
      </div>

      <div className="view-container-row">
        <div className="view-container-subtitle">Deposit amount</div>
      </div>
      <div className="view-container-row">
        <AmountView
          value={`${
            balance === "" ? 0 : new BigNumber(balance).toFormat()
          } UST`}
          icon="/assets/tokens/ust.png"
          iconBack={true}
          button={
            <Button className="amount-edit-button" onClick={(e) => onBack()}>
              EDIT
            </Button>
          }
        />
      </div>

      <div className="view-container-row">
        <div className="view-container-subtitle">Your % of the Pool* </div>
      </div>
      <div className="view-container-row">
        <AmountView value={`${expectedPoolShare.toFixed(2)} %`} />
      </div>
      <div className="view-container-row" style={{ marginTop: -7 }}>
        <div className="view-container-noticetitle">
          *This rate is dynamic.{" "}
        </div>
      </div>

      <Button
        className={cn("view-container-button", { loading })}
        onClick={(e) => {
          if (loading) return;
          mixpanel.track("CONFIRM_DEPOSIT");
          onConfirmDeposit();
        }}
      >
        {loading ? (
          <>
            <LoadingSpinner />
            {`Depositing UST`}
          </>
        ) : (
          "Confirm Deposit"
        )}
      </Button>
    </ViewContainer>
  );
};

export default DepositConfirm;
