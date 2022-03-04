import React, { useState, useEffect } from "react";
import BigNumber from "bignumber.js";

import ViewContainer from "components/ViewContainer";
import Button from "components/Button";
import AmountView from "components/AmountView";
import WithdrawAmountInput from "components/WithdrawAmountInput";

import cn from 'classnames'

const WithdrawConfirm = ({ onBack, depositedBalance, percentage, onChangeWithdrawPercentage }) => {

  const [collectType, setCollectType] = useState('bLuna')

  return (
    <ViewContainer
      title="Confirm Withdrawal"
      navLeft={true}
      onLeft={() => onBack()}
    >
      <div className="view-container-row">
        <div className="view-container-subtitle">Amount to withdraw</div>
      </div>

      <div className="view-container-row">
        <WithdrawAmountInput
          maxBalance={depositedBalance}
          percentage={percentage}
          onChangeWithdrawPercentage={(value) => onChangeWithdrawPercentage(value)}
        />
      </div>

      <div className="view-container-row">
        <div className="view-container-subtitle">Collect as</div>
      </div>
      <div className="view-container-row">
        <div className="collect-select">
          <div className={cn("collect-item", { selected: collectType === 'bLuna'})} onClick={(e) => setCollectType('bLuna')}>
            <img src="/assets/tokens/bLuna.png"/>
            <span>bLUNA</span>
          </div>
          <div className={cn("collect-item", { selected: collectType === 'ust' })} onClick={(e) => setCollectType('ust')}>
            <img src="/assets/tokens/ust.png" />
            <span>UST</span>
          </div>
        </div>
      </div>

      <Button className="view-container-button">Confirm Deposit</Button>
    </ViewContainer>
  );
};

export default WithdrawConfirm;
