import React, { useMemo, useState } from "react";
import { useConnectedWallet } from "@terra-money/wallet-provider";

import ViewContainer from "components/ViewContainer";
import AmountView from "components/AmountView";
import DepositAmountInput from "components/DepositAmountInput";
import LiquidityButton from "components/LiquidityButton";
import ConnectWalletButton from "components/ConnectWalletButton";

import { LIQUIDITY_BALANCE_STATUS } from "types";

import { isNaN, compare } from "utils/number";
import { formatBalance } from "utils/wasm";
import mixpanel from "mixpanel-browser";

mixpanel.init("f5f9ce712e36f5677629c9059c20f3dc");
mixpanel.track("DEPOSIT");

const DepositPool = ({
  onDeposit,
  ustBalance,
  balance,
  volume,
  onChangeDepositInputAmount,
}) => {
  const connectedWallet = useConnectedWallet();
  const [depositChecked, setDepositChecked] = useState(false);

  const liquidityButtonStatus = useMemo((): LIQUIDITY_BALANCE_STATUS => {
    if (isNaN(balance)) {
      return {
        status: "enter_amount",
        text: "Enter an amount",
      };
    }

    if (compare(balance, 0) === 0) {
      return {
        status: "enter_amount",
        text: "Enter an amount",
      };
    }

    if (compare(balance, ustBalance) === 1) {
      return {
        status: "insufficient",
        text: "Insufficient Balance",
      };
    }

    if (!depositChecked) {
      return {
        status: "enter_amount",
        text: "Deposit UST",
      };
    }

    return {
      status: "success",
      text: "Deposit UST",
    };
  }, [balance, ustBalance, depositChecked]);

  return (
    <ViewContainer className="add-liquidity-panel" title="Liquidation Pool ">
      <div className="view-container-row">
        <AmountView
          icon="/assets/tokens/anchor-bluna.png"
          value="Anchor-bLUNA"
          style={{
            fontSize: 20,
            fontWeight: 500,
          }}
        />
      </div>
      <div className="view-container-row">
        <AmountView label="APY" value="0.68%" highlight={true} />
      </div>
      <div className="view-container-row">
        <AmountView
          label="7 day Volume"
          value={`${formatBalance(volume, 1)} UST`}
        />
      </div>
      <div className="view-container-row">
        <div className="view-container-subtitle">Place a deposit</div>
      </div>
      <div className="view-container-row">
        <DepositAmountInput
          maxBalance={ustBalance}
          balance={balance}
          onChangeDepositInputAmount={(value) =>
            onChangeDepositInputAmount(value)
          }
        />
      </div>
      <div className="view-container-row">
        <div className="cooldown-notice">
          <img
            onClick={(e) => setDepositChecked(!depositChecked)}
            src={depositChecked ? "/assets/deposit-checked-on.png" : "/assets/deposit-checked-off.png"}
            className="cooldown-notice-circle"
          />
          <div className="cooldown-notice-text">
            Deposits can be withdrawn one hour after the last successful
            deposit.
          </div>
        </div>
      </div>
      {connectedWallet ? (
        <LiquidityButton
          className="view-container-button"
          onClick={() => onDeposit()}
          label={liquidityButtonStatus.text}
          status={liquidityButtonStatus.status}
        />
      ) : (
        <ConnectWalletButton className="full-width">
          <LiquidityButton
            className="view-container-button"
            onClick={() => {}}
            label={liquidityButtonStatus.text}
            status={liquidityButtonStatus.status}
          />
        </ConnectWalletButton>
      )}
    </ViewContainer>
  );
};

export default DepositPool;
