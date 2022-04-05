import React from "react";
import { useConnectedWallet } from "@terra-money/wallet-provider";
import { Chart, ArcElement } from "chart.js";

import ConnectWalletButton from "components/ConnectWalletButton";

import ViewContainer from "components/ViewContainer";
import Button from "components/Button";
import AmountView from "components/AmountView";
import DonutChart from "components/DonutChart";

import { formatBalance, toBalance } from "utils/wasm";
import { compare } from "utils/number";
import { WITHDRAW_LOCK_TIME } from "utils/constants";

import cn from "classnames";

const YourLiquidityPanel = ({
  myBalance,
  myCap,
  totalLiquidity,
  poolShare,
  onWithdraw,
  lastDepositTime,
  donutValues,
}) => {
  const connectedWallet = useConnectedWallet();

  return (
    <ViewContainer className="your-liquidity-panel" header={false}>
      <a href="/" id="your-liquidity-panel" />
      <div className="your-liquidity-header">
        <div className="your-liquidity-value">
          <div className="your-liquidity-value-title">Your Total Liquidity</div>
          <div className="your-liquidity-value-value">
            {`${formatBalance(myCap, 6)} UST`}
          </div>
        </div>
        <div className="your-liquidity-header-border">
          <div className="insider"></div>
        </div>
      </div>
      <div className="view-container-chart">
        <div className="chart-section">
          {donutValues && (
            <DonutChart
              donutValues={donutValues}
              data={{
                labels: ["Liquid UST Balance", "UST in Bids", "bLUNA Balance"],
                datasets: [
                  {
                    data: [
                      toBalance(donutValues.blunaUST, 6), //  bluna balance
                      toBalance(donutValues.ustBid, 6), //  ust in bids
                      toBalance(donutValues.ust, 6), //  ust in liquidity
                    ],
                    backgroundColor: ["#37FAD3", "#FFFFFF", "#B6B2EF"],
                    hoverBackgroundColor: ["#37FAD3", "#FFFFFF", "#B6B2EF"],
                    hoverOffset: 0,
                    cutout: "70%",
                    borderWidth: 0,
                    rotate: 360,
                  },
                ],
              }}
            />
          )}
        </div>
      </div>
      <div className="view-container-row">
        <AmountView
          label="Your % of the Pool"
          value={`${poolShare.toFixed(2)}%`}
          vertical={true}
        />
      </div>
      {/* <div className="view-container-row" style={{ color: "#60699E" }}>
        Deposits can be withdrawn one hour after your last successful deposit.
      </div> */}
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

Chart.register(ArcElement);

export default YourLiquidityPanel;
