import React, { useState, useEffect } from "react";

import {
  useWallet,
  WalletStatus,
  ConnectType,
  useConnectedWallet,
  useLCDClient,
} from "@terra-money/wallet-provider";
import { CopyToClipboard } from "react-copy-to-clipboard";

import Button from "components/Button";
import { ModalContainer, ModalSelectWallet } from "components/Modal";

import { getWalletAddressEllipsis } from "utils/common";

import cn from 'classnames'

const ConnectWalletButton = ({ className = "" }) => {
  const {
    status,
    network,
    wallets,
    availableConnectTypes,
    availableInstallTypes,
    availableConnections,
    supportFeatures,
    connect,
    install,
    disconnect,
  } = useWallet();

  // const lcd = useLCDClient();
  // const connectedWallet = useConnectedWallet();

  // const [bank, setBank] = useState<null | string>();

  // useEffect(() => {
  //   if (lcd && connectedWallet) {
  //     lcd.bank.balance(connectedWallet.walletAddress).then(([coins]) => {
  //       setBank(coins.toString());
  //     });
  //   } else {
  //     setBank(null);
  //   }
  // }, [connectedWallet, lcd]);

  const [copied, setCopied] = useState(false);

  const [showChooseWalletModal, setShowChooseWalletModal] = useState(false);
  const [showWalletInfo, setShowWalletInfo] = useState(false);

  const handleConnectTerraStationWallet = () => {
    setShowWalletInfo(false)
    setShowChooseWalletModal(false);
    connect(ConnectType.EXTENSION);
  };

  const handleConnectWalletConnect = () => {
    setShowWalletInfo(false);
    setShowChooseWalletModal(false);
    connect(ConnectType.WALLETCONNECT);
  }

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  }, [copied]);

  return (
    <div className={cn("connnect-wallet-button-container", className)}>
      {status === WalletStatus.WALLET_NOT_CONNECTED && (
        <Button
          className="wallet-button not-connected"
          onClick={(e) => setShowChooseWalletModal(true)}
        >
          Connect Wallet
        </Button>
      )}
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

              <CopyToClipboard
                text={wallets[0].terraAddress}
                onCopy={() => setCopied(true)}
              >
                <div className="copy-address">
                  <img className="icon" src="/assets/copy.png" />
                  <span className="copied ">
                    {copied ? "Copied" : "Copy Address"}
                  </span>
                </div>
              </CopyToClipboard>

              {/* <div className="wallet-balance">
                <div className="wallet-balance-token">1.000 UST</div>
                <div className="wallet-balance-token">1.000 UST</div>
                <div className="wallet-balance-token">1.000 UST</div>
                <div className="wallet-balance-token">1.000 UST</div>
              </div> */}

              <Button
                className="wallet-disconnect-button"
                onClick={(e) => {
                  disconnect();
                  setCopied(false);
                  setShowWalletInfo(false)
                }}
              >
                Disconnect Wallet
              </Button>
            </div>
          )}
        </>
      )}
      {showChooseWalletModal && (
        <ModalContainer
          onClose={() => setShowChooseWalletModal(false)}
        >
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
