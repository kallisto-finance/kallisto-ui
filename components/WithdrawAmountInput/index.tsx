import React, { useState } from "react";
import BigNumber from "bignumber.js";

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import Button from "components/Button";

const WithdrawAmountInput = ({
  maxBalance,
  percentage,
  onChangeWithdrawPercentage,
}) => {
  return (
    <div className="withdraw-amount-input-container">
      <div className="withdraw-balance-section">
        <div className="balance-value">{`${new BigNumber(maxBalance).toFormat()}`}<span>UST</span></div>
        <div className="withdraw-percentage-selector">
          <Button className="percent-selector" onClick={(e) => onChangeWithdrawPercentage(25)}>25%</Button>
          <Button className="percent-selector" onClick={(e) => onChangeWithdrawPercentage(50)}>50%</Button>
          <Button className="percent-selector" onClick={(e) => onChangeWithdrawPercentage(75)}>75%</Button>
          <Button className="percent-selector max" onClick={(e) => onChangeWithdrawPercentage(100)}>MAX</Button>
        </div>
      </div>
      <div className="amount-slider-section">
        <Slider
          min={0}
          max={100}
          railStyle={{ backgroundColor: '#B6B2EF', height: 5 }}
          trackStyle={{ backgroundColor: '#B6B2EF', height: 5 }}
          handleStyle={{
            border: 'none',
            height: 28,
            width: 28,
            marginTop: -12,
            background: '#B6B2EF',
            opacity: 1,
          }}
          value={percentage}
          onChange={(value) => onChangeWithdrawPercentage(value)}
        />
      </div>
    </div>
  );
};

export default WithdrawAmountInput;
