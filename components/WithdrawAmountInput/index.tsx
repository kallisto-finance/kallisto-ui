import React, { useState } from "react";
import BigNumber from "bignumber.js";

import Button from "components/Button";

import cn from "classnames";

const WithdrawAmountInput = ({
  maxBalance,
  withdrawAmount,
  onChangeWithdrawAmount,
  collectType,
}) => {
  const [percent, setPercent] = useState(0);

  const handleClickPercentage = (value) => {
    setPercent(value)
    const balance = new BigNumber(maxBalance)
      .multipliedBy(value)
      .dividedBy(100);
    onChangeWithdrawAmount(balance);
  };

  return (
    <div className="withdraw-amount-input-container">
      <div className="withdraw-balance-section">
        <div className="balance-input">
          <div className="line"></div>
          <input
            type="text"
            className="input"
            value={withdrawAmount.toString()}
            onChange={(e) => {
              setPercent(0);
              onChangeWithdrawAmount(e.target.value);
            }}
          />
          <span className="collect-type">{collectType}</span>
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
