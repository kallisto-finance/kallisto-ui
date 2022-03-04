import React from "react";

import Button from "components/Button";

const DepositAmountInput = ({
  maxBalance,
  balance,
  onChangeDepositInputAmount,
}) => {
  return (
    <div className="deposit-amount-input-container">
      <div className="label">Deposit amount</div>
      <div className="divider"></div>
      <div className="input">
        <input
          className="inputbox"
          type="text"
          placeholder="1,000.000 UST"
          value={balance}
          onChange={(e) => onChangeDepositInputAmount(e.target.value)}
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
