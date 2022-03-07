import React, { useMemo } from "react"

import { LIQUIDITY_BALANCE_STATUS } from 'types'

import ViewContainer from "components/ViewContainer"
import AmountView from "components/AmountView";
import DepositAmountInput from 'components/DepositAmountInput'
import LiquidityButton from 'components/LiquidityButton'

import { isNaN, compare } from 'utils/number'

const DepositPool = ({ onDeposit, ustBalance, balance, onChangeDepositInputAmount }) => {

  const liquidityButtonStatus = useMemo((): LIQUIDITY_BALANCE_STATUS => {

    if (isNaN(balance)) {
      return {
        status: "enter_amount",
        text: "Enter an amount"
      }
    }

    if (compare(balance, 0) === 0) {
      return {
        status: "enter_amount",
        text: "Enter an amount"
      }
    }

    if (compare(balance, ustBalance) === 1) {
      return {
        status: "insufficient",
        text: "Insufficient Balance"
      }
    }

    return {
      status: "success",
      text: "Deposit UST"
    }

  }, [balance, ustBalance]);

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
          label="7 day Volume"
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
      <LiquidityButton className="view-container-button" onClick={() => onDeposit()} label={liquidityButtonStatus.text} status={liquidityButtonStatus.status} />
    </ViewContainer>
  );
};

export default DepositPool;
