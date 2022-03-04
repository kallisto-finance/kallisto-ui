import React, { useState, useEffect } from "react";
import BigNumber from "bignumber.js";

import ViewContainer from "components/ViewContainer";
import Button from "components/Button";
import AmountView from "components/AmountView";

const DepositConfirm = ({ onBack, balance }) => {
  return (
    <ViewContainer title="Confirm your Deposit" navLeft={true} onLeft={() => onBack()}>
      <div className="view-container-row">
        <div className="view-container-subtitle">Collateral Market</div>
      </div>

      <div className="view-container-row half">
        <AmountView value="bLuna" icon="/assets/tokens/bLuna.png" />
      </div>

      <div className="view-container-row">
        <div className="view-container-subtitle">Deposit amount</div>
      </div>
      <div className="view-container-row">
        <AmountView value={`${balance === '' ? 0 : new BigNumber(balance).toFormat()} UST`} />
      </div>

      <div className="view-container-row">
        <div className="view-container-subtitle">Your % of the Pool* </div>
        <div className="view-container-noticetitle">*This rate is dynamic. </div>
      </div>
      <div className="view-container-row">
        <AmountView value="11 %" />
      </div>

      <Button className="view-container-button">
        Confirm Deposit
      </Button>
    </ViewContainer>
  );
};

export default DepositConfirm;
