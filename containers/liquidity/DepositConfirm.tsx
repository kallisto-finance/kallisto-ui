import React, { useState, useEffect } from "react";
import BigNumber from "bignumber.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

import ViewContainer from "components/ViewContainer";
import Button from "components/Button";

const DepositConfirm = ({ onBack, balance }) => {
  return (
    <ViewContainer logo={false}>
      <div className="view-container-nav">
        <div className="view-navigator" onClick={(e) => onBack()}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </div>
        <div className="view-container-title">CONFIRM YOUR DEPOSIT</div>
      </div>

      <div className="view-container-row">
        <div className="view-container-subtitle">Collateral Market</div>
      </div>

      <div className="view-container-row border half">
        <div className="view-container-market">
          <img className="market-token" src="/assets/tokens/bLuna.png" />
          <span className="market-name">bLuna</span>
        </div>
      </div>

      <div className="view-container-row">
        <div className="view-container-subtitle">Deposit amount</div>
      </div>
      <div className="view-container-row border">
        <div className="view-container-info">
          <span className="value">{new BigNumber(balance).toFormat()} UST</span>
        </div>
      </div>

      <div className="view-container-row">
        <div className="view-container-subtitle">Your % of the Pool* </div>
      </div>
      <div className="view-container-row border">
        <div className="view-container-info">
          <span className="value">1912%*</span>
        </div>
      </div>
      <div className="view-container-row">
        <div className="view-container-noticetitle">
          *This rate is dynamic.{" "}
        </div>
      </div>

      <div className="view-container-row">
        <Button
          className="view-container-button deposit"
        >
          Confirm Deposit
        </Button>
      </div>
    </ViewContainer>
  );
};

export default DepositConfirm;
