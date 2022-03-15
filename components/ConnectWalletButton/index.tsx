import React, { useState, useEffect, useRef } from "react";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";
import {
  useWallet,
  WalletStatus,
  ConnectType,
  useConnectedWallet,
} from "@terra-money/wallet-provider";

import Button from "components/Button";
import { ModalContainer, ModalSelectWallet } from "components/Modal";

import { getWalletAddressEllipsis } from "utils/common";
import { getBalance, formatBalance } from "utils/wasm";
import { addresses } from "utils/constants";
import { useLCDClient, useOutsideAlerter } from "hooks";

import cn from "classnames";

const ConnectWalletButton = ({ className = "", children = null }) => {
  const {
    status,
    network,
    wallets,
    availableInstallTypes,
    connect,
    disconnect,
  } = useWallet();

  const lcd = useLCDClient();
  const connectedWallet = useConnectedWallet();

  const [balance, setBalance] = useState({
    ust: "0.0",
    aUST: "0.0",
    bETH: "0.0",
    bLUNA: "0.0",
  });

  const fetchBalances = async () => {
    if (connectedWallet && lcd && network) {
      lcd.bank.balance(connectedWallet.walletAddress).then(async ([coins]) => {
        const aUSTBalance = await getBalance(
          addresses[network.chainID].contracts.aUST.address,
          connectedWallet.walletAddress,
          network.chainID
        );
        const bETHBalance = await getBalance(
          addresses[network.chainID].contracts.bETH.address,
          connectedWallet.walletAddress,
          network.chainID
        );
        const bLunaBalance = await getBalance(
          addresses[network.chainID].contracts.bLuna.address,
          connectedWallet.walletAddress,
          network.chainID
        );


        const ustBalance = "uusd" in coins._coins ? coins._coins.uusd.amount : 0;

        setBalance({
          ust: formatBalance(ustBalance, 1),
          aUST: formatBalance(aUSTBalance["balance"], 1),
          bETH: formatBalance(bETHBalance["balance"], 1),
          bLUNA: formatBalance(bLunaBalance["balance"], 1),
        });
      });
    } else {
      setBalance({
        ust: "0.000",
        aUST: "0.000",
        bETH: "0.000",
        bLUNA: "0.000",
      });
    }
  };

  useEffect(() => {
    let interval = null;

    interval = setInterval(() => {
      fetchBalances();
    }, 1500);

    return () => clearInterval(interval);
  }, [connectedWallet, lcd, network]);

  const [showChooseWalletModal, setShowChooseWalletModal] = useState(false);
  const [showWalletInfo, setShowWalletInfo] = useState(false);

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, () => {
    setShowWalletInfo(false);
  });

  const handleConnectTerraStationWallet = async () => {
    if (availableInstallTypes.includes(ConnectType.EXTENSION)) {
      window.open(
        "https://chrome.google.com/webstore/detail/terra-station-wallet/aiifbnbfobpmeekipheeijimdpnlpgpp"
      );
    } else {
      setShowWalletInfo(false);
      setShowChooseWalletModal(false);
      connect(ConnectType.EXTENSION);
    }
  };

  const handleConnectWalletConnect = () => {
    setShowWalletInfo(false);
    setShowChooseWalletModal(false);
    connect(ConnectType.WALLETCONNECT);
  };

  return (
    <div
      className={cn("connnect-wallet-button-container", className)}
      ref={wrapperRef}
    >
      {status === WalletStatus.WALLET_NOT_CONNECTED &&
        (children ? (
          <div
            onClick={(e) => {
              setShowChooseWalletModal(true);
            }}
            style={{ cursor: "pointer", width: "100%" }}
          >
            {children}
          </div>
        ) : (
          <Button
            className="wallet-button not-connected"
            onClick={(e) => setShowChooseWalletModal(true)}
          >
            Connect Wallet
          </Button>
        ))}
      {status === WalletStatus.WALLET_CONNECTED && (
        <>
          <Button
            className="wallet-button connected"
            onClick={(e) => setShowWalletInfo(!showWalletInfo)}
          >
            <span>
              {getWalletAddressEllipsis(wallets[0].terraAddress, 10, 5)}
            </span>
            <img src="/assets/terra-station.png" />
          </Button>
          {showWalletInfo && (
            <div className="wallet-info">
              <div className="wallet-info-address">
                <div className="circle"></div>
                <span className="address">
                  {getWalletAddressEllipsis(wallets[0].terraAddress, 15, 10)}
                </span>
              </div>

              <div className="wallet-balance">
                <div className="wallet-balance-token">{balance.ust} UST</div>
                <div className="wallet-balance-token">{balance.aUST} aUST</div>
                <div className="wallet-balance-token">{balance.bETH} bETH</div>
                <div className="wallet-balance-token">
                  {balance.bLUNA} bLUNA
                </div>
              </div>

              <Button
                className="wallet-disconnect-button"
                onClick={(e) => {
                  disconnect();
                  setShowWalletInfo(false);
                }}
              >
                Disconnect Wallet
              </Button>
            </div>
          )}
        </>
      )}
      {showChooseWalletModal && (
        <ModalContainer onClose={() => setShowChooseWalletModal(false)}>
          <ModalSelectWallet
            onChooseTerraWallet={() => handleConnectTerraStationWallet()}
            onChooseWalletConnect={() => handleConnectWalletConnect()}
          />
        </ModalContainer>
      )}
    </div>
  );
};

export default ConnectWalletButton;
