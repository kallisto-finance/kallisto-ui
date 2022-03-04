import React, { useState, useEffect } from "react";
import { useConnectedWallet } from "@terra-money/wallet-provider";
import BigNumber from "bignumber.js";

import ConnectWalletButton from "components/ConnectWalletButton";

import ViewContainer from "components/ViewContainer";
import Button from "components/Button";
import AmountView from "components/AmountView";
import DepositAmountInput from "components/DepositAmountInput";

const YourLiquidityPanel = ({
  onDeposit,
  ustBalance,
  balance,
  onWithdraw,
}) => {
  const connectedWallet = useConnectedWallet();

  return (
    <ViewContainer
      className="your-liquidity-panel"
      title="Your Liquidity"
      border={true}
    >
      <div className="view-container-row">
        <AmountView
          label="Earnings"
          value="1.000 UST"
          highlight={true}
          vertical={true}
        />
      </div>
      <div className="view-container-row">
        <AmountView
          label="Total Liquidity"
          value="103.000 UST"
          vertical={true}
          background={true}
        />
      </div>
      <div className="view-container-row">
        <AmountView label="% of the Pool" value="54%" vertical={true} />
      </div>
      <Button className="view-container-button" onClick={() => onWithdraw()}>Withdraw</Button>
    </ViewContainer>
  );
};

export default YourLiquidityPanel;
