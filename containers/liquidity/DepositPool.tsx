import React, { useState, useEffect } from "react"
import { useConnectedWallet } from "@terra-money/wallet-provider";
import BigNumber from 'bignumber.js'

import ConnectWalletButton from 'components/ConnectWalletButton'

import ViewContainer from "components/ViewContainer"
import Button from "components/Button"
import DepositAmountInput from 'components/DepositAmountInput'

const DepositPool = ({ onDeposit, ustBalance, balance, onChangeDepositInputAmount }) => {
  const connectedWallet = useConnectedWallet()

  return (
    <ViewContainer logo={true}>
      <div className="view-container-title">KALLISTO LIQUIDITY POOL</div>
      <div className="view-container-row">
        <div className="view-container-subtitle">Your current balance</div>
      </div>
      <div className="view-container-row">
        <div className="view-container-balance">{ustBalance} UST</div>
      </div>
      <div className="view-container-row border">
        <div className="view-container-info">
          <span className="value">100%</span>
          <span className="description">APY</span>
        </div>
      </div>
      <div className="view-container-row border">
        <div className="view-container-info">
          <span className="value">6,946,194 UST</span>
          <span className="description">24 hr Volume</span>
        </div>
      </div>
      <div className="view-container-row">
        <div className="view-container-subtitle">Collateral Market</div>
      </div>
      <div className="view-container-row border hoverable">
        <div className="view-container-market">
          <img className="market-token" src="/assets/tokens/bLuna.png" />
          <span className="market-name">bLuna</span>
        </div>
      </div>
      <div className="view-container-row">
        <div className="view-container-subtitle">Place a deposit</div>
      </div>
      <div className="view-container-row border hoverable">
        <DepositAmountInput maxBalance={ustBalance} balance={balance} onChangeDepositInputAmount={(value) => onChangeDepositInputAmount(value)} />
      </div>
      <div className="view-container-row">
        {connectedWallet && (<Button className="view-container-button deposit" onClick={(e) => onDeposit()}>Deposit</Button>)}
        {!connectedWallet && (<ConnectWalletButton className="full-width" />)}
      </div>
    </ViewContainer>
  );
};

export default DepositPool;
