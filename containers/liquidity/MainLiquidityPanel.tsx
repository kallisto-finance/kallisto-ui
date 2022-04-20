import React, { useEffect, useState } from "react";
import BigNumber from "bignumber.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

import ViewContainer from "components/ViewContainer";
import { formatBalance } from "utils/wasm";

import cn from "classnames";

const MainLiquidityPanel = ({ pools, bLunaPrice, progress }) => {
  const [myLiquidity, setMyLiquidity] = useState(new BigNumber(0));
  const [liquidity, setLiquidity] = useState(new BigNumber(0));

  useEffect(() => {
    let mySum = new BigNumber(0);
    let sum = new BigNumber(0);

    for (let i = 0; i < pools.length; i++) {
      mySum = mySum.plus(pools[i].userCap);
      sum = sum.plus(pools[i].totalCap);
    }

    setMyLiquidity(mySum);
    setLiquidity(sum);
  }, [pools]);

  return (
    <ViewContainer className="main-liquidity-panel" header={false}>
      <a href="/" id="main-liquidity-panel" />
      <div className="total-liquidity-wrapper">
        <div className="title">My Total Liquidity</div>
        <div className="value">{formatBalance(myLiquidity, 1)} UST</div>
        {/* <div className="withdraw-button">
          Withdraw <img src="/assets/arrows/arrow-top-right.png" />
        </div> */}
      </div>
      <div className={cn("divider", { zero: progress === 0 })}>
        {progress > 0 && (
          <div className="divider-progress" style={{ width: `${progress}%` }} />
        )}
      </div>
      <div className="liquidation-volume-wrapper">
        <div className="liquidation-volume-item">
          <div className="title">
            Kallisto Total
            <br />
            Liquidity
          </div>
          <div className="value">{formatBalance(liquidity, 1)}</div>
        </div>
        <div className="liquidation-volume-item">
          <div className="title">bLuna Price</div>
          <div className="value">{bLunaPrice.price.toFixed(1)}</div>
          {bLunaPrice.increase !== "" && bLunaPrice.increase !== "0" && (
            <div
              className={cn("price-change", {
                up: Number(bLunaPrice.increase) > 0,
                down: Number(bLunaPrice.increase) < 0,
              })}
            >
              {Math.abs(Number(bLunaPrice.increase))}%
              {Number(bLunaPrice.increase) > 0 ? (
                <FontAwesomeIcon icon={faChevronUp as IconProp} />
              ) : (
                <FontAwesomeIcon icon={faChevronDown as IconProp} />
              )}
            </div>
          )}
        </div>
      </div>
    </ViewContainer>
  );
};

export default MainLiquidityPanel;
