import React, { useEffect, useState } from "react";
import Link from "next/link";
import BigNumber from "bignumber.js";
import { Chart, ArcElement } from "chart.js";
import { useConnectedWallet } from "@terra-money/wallet-provider";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import ConnectWalletButton from "components/ConnectWalletButton";
import ViewContainer from "components/ViewContainer";
import DonutChart from "components/DonutChart";
import Button from "components/Button";

import { formatBalance, toBalance } from "utils/wasm";
import { compare } from "utils/number";
import { WITHDRAW_LOCK_TIME } from "utils/constants";

import cn from "classnames";

const MyLiquidityPanel = ({ pool, bLunaPrice, onBackToPools, onWithdraw }) => {
  const connectedWallet = useConnectedWallet();

  const [donutData, setDonutData] = useState({
    ust: new BigNumber(0),
    bluna: new BigNumber(0),
    blunaUST: new BigNumber(0),
    ustBid: new BigNumber(0),
  });

  useEffect(() => {
    if (pool === null) {
      return;
    }

    const donut = { ...donutData };

    donut.ust =
      compare(pool.totalSupply, 0) === 1
        ? new BigNumber(0)
        : pool.poolUSTBalance
            .multipliedBy(pool.userBalance)
            .dividedBy(pool.totalSupply);

    donut.bluna =
      compare(pool.totalSupply, 0) === 1
        ? new BigNumber(0)
        : pool.poolbLunaBalance
            .multipliedBy(pool.userBalance)
            .dividedBy(pool.totalSupply);

    donut.blunaUST = donut.bluna.multipliedBy(bLunaPrice.price);
    donut.ustBid = pool.userCap.minus(donut.ust).minus(donut.blunaUST);

    if (compare(donut.ustBid, 0) === -1) {
      donut.ustBid = new BigNumber(0);
    }

    setDonutData(donut);
  }, [pool, bLunaPrice]);

  return (
    <>
      <div className="back-to-pools" onClick={(e) => onBackToPools()}>
        <FontAwesomeIcon icon={faArrowLeft as IconProp} />
        <span>Pools</span>
      </div>
      <ViewContainer className="my-liquidity-panel" header={false}>
        <a href="/" id="main-liquidity-panel" />
        <div className="total-liquidity-wrapper">
          <div className="title">My Pool Liquidity</div>
          <div className="value">{formatBalance(pool.userCap, 2)} UST</div>
          <Link href="/dashboard">
            <div className="withdraw-button">
              Dashboard <img src="/assets/arrows/arrow-top-right.png" />
            </div>
          </Link>
        </div>
        <div className="divider zero"></div>
        <div className="liqudation-donut-wrapper">
          <DonutChart
            donutValues={donutData}
            data={{
              labels: ["Liquid UST Balance", "UST in Bids", "bLUNA Balance"],
              datasets: [
                {
                  data: [
                    toBalance(donutData.blunaUST, 6), //  bluna balance
                    toBalance(donutData.ustBid, 6), //  ust in bids
                    toBalance(donutData.ust, 6), //  ust in liquidity
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
        </div>
        <div className="divider zero"></div>
        <div className="liqudation-percentage">
          <div className="title">My % of the Pool</div>
          <div className="value">{`${
            compare(pool.totalSupply, 0) === 0
              ? "0"
              : pool.userBalance
                  .dividedBy(pool.totalSupply)
                  .multipliedBy(100)
                  .toFixed(2)
          } %`}</div>
        </div>
        {connectedWallet ? (
          <Button
            className={cn("view-container-button", {
              withdraw:
                compare(pool.userBalance, 0) > 0 &&
                new Date().getTime() * 1000 * 1000 >
                  Number(pool.lastDepositedTime) + WITHDRAW_LOCK_TIME,
              "enter-amount":
                compare(pool.userBalance, 0) <= 0 ||
                new Date().getTime() * 1000 * 1000 <=
                  Number(pool.lastDepositedTime) + WITHDRAW_LOCK_TIME,
            })}
            onClick={() => {
              // console.log(new Date().getTime() * 1000 * 1000);
              // console.log(Number(pool.lastDepositedTime) + WITHDRAW_LOCK_TIME);
              if (compare(pool.userBalance, 0) <= 0) return;
              if (
                new Date().getTime() * 1000 * 1000 <=
                Number(pool.lastDepositedTime) + WITHDRAW_LOCK_TIME
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
    </>
  );
};

Chart.register(ArcElement);

export default MyLiquidityPanel;
