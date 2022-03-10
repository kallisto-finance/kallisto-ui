import React, { useState } from "react";
import BigNumber from "bignumber.js";

import Button from "components/Button";

import { formatBalance } from 'utils/wasm';

import cn from "classnames";

const WithdrawAmountInput = ({
  maxBalance,
  withdrawAmount,
  onChangeWithdrawAmount,
  collectType,
}) => {
  const [isFocus, setIsFocus] = useState(false);

  const [percent, setPercent] = useState(0);

  const handleClickPercentage = (value) => {
    setPercent(value)
    const balance = new BigNumber(maxBalance)
      .multipliedBy(value)
      .dividedBy(100).dividedBy(10 ** 6);
    onChangeWithdrawAmount(balance);
  };

  return (
    <div className="withdraw-amount-input-container">
      <div className="withdraw-balance-section">
        <div className="balance-input">
          <div className={cn("divider", { focus: !isFocus })}></div>
          <input
            type="text"
            className="input"
            value={withdrawAmount.format}
            onChange={(e) => {
              setPercent(0);
              onChangeWithdrawAmount(e.target.value);
            }}
            onFocus={(e) => {
              setIsFocus(true);
            }}
            onBlur={(e) => {
              setIsFocus(false);
            }}
          />
          {/* <span className="collect-type">{collectType}</span> */}
          <span className="collect-type">{` / `}{formatBalance(maxBalance)} UST</span>
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
