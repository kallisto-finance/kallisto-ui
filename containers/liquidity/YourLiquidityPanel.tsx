import React from "react";
import { useConnectedWallet } from "@terra-money/wallet-provider";

import ConnectWalletButton from "components/ConnectWalletButton";

import ViewContainer from "components/ViewContainer";
import Button from "components/Button";
import AmountView from "components/AmountView";

import { formatBalance } from "utils/wasm";
import { compare } from "utils/number";
import { WITHDRAW_LOCK_TIME } from "utils/constants";

import cn from "classnames";

const YourLiquidityPanel = ({
  myBalance,
  totalLiquidity,
  poolShare,
  onWithdraw,
  lastDepositTime,
}) => {
  const connectedWallet = useConnectedWallet();

  return (
    <ViewContainer
      className="your-liquidity-panel"
      title="Your Liquidity"
      border={false}
    >
      <a href="/" id="your-liquidity-panel" />
      <div className="view-container-row">
        <AmountView
          label="Your Balance"
          value={`${formatBalance(myBalance, 1)} UST`}
          highlight={true}
          vertical={true}
        />
      </div>
      <div className="view-container-row">
        <AmountView
          label="Total Pool Liquidity"
          value={`${formatBalance(totalLiquidity, 1)} UST`}
          vertical={true}
          background={true}
        />
      </div>
      <div className="view-container-row">
        <AmountView
          label="Your % of the Pool"
          value={`${poolShare.toFixed(2)}%`}
          vertical={true}
        />
      </div>
      <div className="view-container-row" style={{ color: "#60699E" }}>
        Deposits can be withdrawn one hour after your last successful deposit.
      </div>
      {connectedWallet ? (
        <Button
          className={cn("view-container-button", {
            withdraw:
              compare(myBalance, 0) > 0 &&
              new Date().getTime() * 1000 * 1000 >
                Number(lastDepositTime) + WITHDRAW_LOCK_TIME,
            "enter-amount":
              compare(myBalance, 0) <= 0 ||
              new Date().getTime() * 1000 * 1000 <=
                Number(lastDepositTime) + WITHDRAW_LOCK_TIME,
          })}
          onClick={() => {
            console.log(new Date().getTime() * 1000 * 1000);
            console.log(Number(lastDepositTime) + WITHDRAW_LOCK_TIME);
            if (compare(myBalance, 0) <= 0) return;
            if (
              new Date().getTime() * 1000 * 1000 <=
              Number(lastDepositTime) + WITHDRAW_LOCK_TIME
            )
              return;
            onWithdraw();
          }}
        >
          Withdraw
        </Button>
      ) : (
        <ConnectWalletButton className="full-width">
          <Button
            className="view-container-button enter-amount"
            onClick={() => {}}
          >
            Withdraw
          </Button>
        </ConnectWalletButton>
      )}
    </ViewContainer>
  );
};

export default YourLiquidityPanel;
