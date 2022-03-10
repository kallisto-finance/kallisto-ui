import React, { useState } from "react";

import Button from "components/Button";

import cn from "classnames";

const DepositAmountInput = ({
  maxBalance,
  balance,
  onChangeDepositInputAmount,
}) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <div className="deposit-amount-input-container">
      <div className="label">Deposit amount</div>
      <div className={cn("divider", { focus: !isFocus })}></div>
      <div className="input">
        <input
          className="inputbox"
          type="text"
          placeholder="1,000.000 UST"
          value={balance}
          onChange={(e) => onChangeDepositInputAmount(e.target.value)}
          onFocus={(e) => {
            setIsFocus(true);
          }}
          onBlur={(e) => {
            setIsFocus(false);
          }}
        />
      </div>
      <Button
        className="max-button"
        onClick={(e) => onChangeDepositInputAmount(maxBalance)}
      >
        MAX
      </Button>
    </div>
  );
};

export default DepositAmountInput;
