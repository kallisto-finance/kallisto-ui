import React, { useRef, useEffect } from "react";

import Button from "components/Button";

import { isNaN } from 'utils/number';

const DepositAmountInput = ({
  maxBalance,
  balance,
  onChangeDepositInputAmount,
}) => {
  const inputEl = useRef(null)

  useEffect(() => {
    if (inputEl) {
      setTimeout(() => {
        inputEl.current.focus();
      }, 500)
    }
  }, [inputEl])
  
  return (
    <div className="deposit-amount-input-container">
      <div className="label">Deposit amount</div>
      <div className="input">
        <input
          ref={inputEl}
          autoFocus
          className="inputbox"
          type="text"
          placeholder=""
          value={balance}
          onChange={(e) => {
            if (e.target.value !== '' && isNaN(e.target.value)) return;
            onChangeDepositInputAmount(e.target.value)
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
