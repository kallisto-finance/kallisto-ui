import React, { useState, useRef, useEffect } from "react";
import BigNumber from "bignumber.js";

import Button from "components/Button";

import { formatBalance } from "utils/wasm";
import { isNaN } from "utils/number";

import cn from "classnames";

const WithdrawAmountInput = ({
  maxBalance,
  withdrawAmount,
  onChangeWithdrawAmount,
  collectType,
}) => {
  const [percent, setPercent] = useState(0);

  const inputEl = useRef(null);

  useEffect(() => {
    if (inputEl) {
      setTimeout(() => {
        inputEl.current.focus();
      }, 500);
    }
  }, [inputEl]);

  const handleClickPercentage = (value) => {
    setPercent(value);
    const balance = new BigNumber(maxBalance)
      .multipliedBy(value)
      .dividedBy(100)
      .dividedBy(10 ** 6);
    onChangeWithdrawAmount(balance);
  };

  return (
    <div className="withdraw-amount-input-container">
      <div className="withdraw-balance-section">
        <div className="balance-input">
          <input
            type="text"
            className="input"
            ref={inputEl}
            autoFocus
            value={withdrawAmount.format}
            onChange={(e) => {
              if (e.target.value !== "" && isNaN(e.target.value)) return;
              setPercent(0);
              onChangeWithdrawAmount(e.target.value);
            }}
          />
          {/* <span className="collect-type">{collectType}</span> */}
          <span className="collect-type">
            {` / `}
            {formatBalance(maxBalance)} UST
          </span>
        </div>
        <div className="withdraw-percentage-selector">
          <Button
            className={cn("percent-selector", { selected: percent === 25 })}
            onClick={(e) => handleClickPercentage(25)}
          >
            25%
          </Button>
          <Button
            className={cn("percent-selector", { selected: percent === 50 })}
            onClick={(e) => handleClickPercentage(50)}
          >
            50%
          </Button>
          <Button
            className={cn("percent-selector", { selected: percent === 75 })}
            onClick={(e) => handleClickPercentage(75)}
          >
            75%
          </Button>
          <Button
            className={cn("percent-selector", { selected: percent === 100 })}
            onClick={(e) => handleClickPercentage(100)}
          >
            MAX
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawAmountInput;
