import React, { useState, useEffect } from "react"
import { useConnectedWallet } from "@terra-money/wallet-provider";
import BigNumber from 'bignumber.js'

import ConnectWalletButton from 'components/ConnectWalletButton'
import AmountView from "components/AmountView";

import ViewContainer from "components/ViewContainer"
import Button from "components/Button"
import DepositAmountInput from 'components/DepositAmountInput'

const DepositPool = ({ onDeposit, ustBalance, balance, onChangeDepositInputAmount }) => {
  const connectedWallet = useConnectedWallet()

  return (
    <ViewContainer 
      className="add-liquidity-panel"
      title="Liquidation Pool "
    >
      <div className="view-container-row">
        <AmountView
          label="APY"
          value="100%"
          highlight={true}
        />
      </div>
      <div className="view-container-row">
        <AmountView
          label="24 hr Volume"
          value="6,946,194 UST"
        />
      </div>
      <div className="view-container-row">
        <div className="view-container-subtitle">Collateral Market</div>
      </div>
      <div className="view-container-row">
        <AmountView
          icon="/assets/tokens/bLuna.png"
          value="bLuna"
        />
      </div>
      <div className="view-container-row">
        <div className="view-container-subtitle">Place a deposit</div>
      </div>
      <div className="view-container-row">
        <DepositAmountInput maxBalance={ustBalance} balance={balance} onChangeDepositInputAmount={(value) => onChangeDepositInputAmount(value)} />
      </div>
      <Button className="view-container-button" onClick={(e) => onDeposit()}>
        Deposit UST
      </Button>
    </ViewContainer>
  );
};

export default DepositPool;
