import React, { useState, useEffect } from "react";

import {
  useWallet,
  WalletStatus,
  ConnectType,
  useConnectedWallet,
} from "@terra-money/wallet-provider";
import { CopyToClipboard } from "react-copy-to-clipboard";

import Button from "components/Button";
import { ModalContainer, ModalSelectWallet } from "components/Modal";

import { getWalletAddressEllipsis } from "utils/common";
import { getBalance, formatBalance } from 'utils/wasm';
import { addresses } from 'utils/constants';
import { useLCDClient } from "hooks";

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

  const lcd = useLCDClient();
  const connectedWallet = useConnectedWallet();

  const [balance, setBalance] = useState({
    ust: '0.000',
    aUST: '0.000',
    bETH: '0.000',
    bLUNA: '0.000'
  })

  useEffect(() => {
    if (connectedWallet && lcd) {
      lcd.bank.balance(connectedWallet.walletAddress).then(async ([coins]) => {
        
        const aUSTBalance = await getBalance(addresses.mainnet.contracts.aUST.address, connectedWallet.walletAddress);
        const bETHBalance = await getBalance(addresses.mainnet.contracts.bETH.address, connectedWallet.walletAddress);
        const bLunaBalance = await getBalance(addresses.mainnet.contracts.bLuna.address, connectedWallet.walletAddress);

        setBalance({
          ust: formatBalance(coins._coins.uusd.amount),
          aUST: formatBalance(aUSTBalance['balance']),
          bETH: formatBalance(bETHBalance['balance']),
          bLUNA: formatBalance(bLunaBalance['balance'])
        })
      });
    } else {
      setBalance({
        ust: '0.000',
        aUST: '0.000',
        bETH: '0.000',
        bLUNA: '0.000'
      })
    }
  }, [connectedWallet, lcd])

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

              <div className="wallet-balance">
                <div className="wallet-balance-token">{balance.ust} UST</div>
                <div className="wallet-balance-token">{balance.aUST} aUST</div>
                <div className="wallet-balance-token">{balance.bETH} bETH</div>
                <div className="wallet-balance-token">{balance.bLUNA} bLUNA</div>
              </div>

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
