import React, { useRef, useEffect } from "react";

import Button from "components/Button";

import { isNaN } from 'utils/number';

import cn from 'classnames';

const DepositAmountInput = ({
  maxBalance,
  balance,
  onChangeDepositInputAmount,
  theme = "default",
  connectedWallet
}) => {
  const inputEl = useRef(null)

  useEffect(() => {
    if (inputEl && connectedWallet) {
      setTimeout(() => {
        inputEl.current.focus();
      }, 500)
    }
  }, [inputEl, connectedWallet])

  return (
    <div className={cn("deposit-amount-input-container", theme)}>
      {/* <div className="label">Deposit amount</div> */}
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
          inputMode='numeric'
          readOnly={!connectedWallet}
        />
      </div>
      <div className="token-icon">
        UST <img src="/assets/tokens/ust.png" />
      </div>
      <Button
        className="max-button"
        onClick={(e) => onChangeDepositInputAmount(maxBalance)}
        disabled={!connectedWallet}
      >
        MAX
      </Button>
    </div>
  );
};

export default DepositAmountInput;
