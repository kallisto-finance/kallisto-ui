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

import cn from "classnames";

mixpanel.init("f5f9ce712e36f5677629c9059c20f3dc");

const DepositPoolContent = (props) => {
  const {
    pool,
    onDeposit,
    ustBalance,
    balance,
    volume,
    onChangeDepositInputAmount,
  } = props;

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
    <ViewContainer
      className={cn("add-liquidity-panel", pool.theme)}
      header={false}
    >
      <div className={cn("pool-token-wrapper", pool.theme)}>
        <img src={pool.icon} />
        <div className="pool-name">
          <div className="pool-name-text">{pool.name}</div>
          <div className={cn("pool-name-category", pool.theme)}>
            {pool.category}
          </div>
        </div>
      </div>
      <div className="view-container-row">
        <AmountView
          label="APY"
          value={`${pool.apy} %`}
          highlight={true}
          theme={pool.theme}
        />
      </div>
      <div className="view-container-row">
        <AmountView
          label="7 day Deposits"
          value={`${formatBalance(volume, 2)} UST`}
          theme={pool.theme}
        />
      </div>
      <div className="view-container-row">
        <AmountView
          label="Liquidity"
          value={`${formatBalance(pool.totalCap, 2)} UST`}
          theme={pool.theme}
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
          theme={pool.theme}
          connectedWallet={connectedWallet}
        />
      </div>
      <div className="view-container-row">
        <div className="cooldown-notice">
          <img
            onClick={(e) => setDepositChecked(!depositChecked)}
            src={
              depositChecked
                ? "/assets/deposit-checked-on.png"
                : "/assets/deposit-checked-off.png"
            }
            className="cooldown-notice-circle"
          />
          <div className="cooldown-notice-text">
            Deposits can be withdrawn one hour after the last successful
            deposit.
          </div>
        </div>
      </div>
      <LiquidityButton
        className="view-container-button"
        onClick={() => onDeposit()}
        label={liquidityButtonStatus.text}
        status={liquidityButtonStatus.status}
      />
    </ViewContainer>
  );
};

const DepositPool = (props) => {
  const connectedWallet = useConnectedWallet();

  return connectedWallet ? (
    <>
      <DepositPoolContent {...props} />
    </>
  ) : (
    <ConnectWalletButton className="full-width">
      <DepositPoolContent {...props} />
    </ConnectWalletButton>
  );
};

export default DepositPool;
