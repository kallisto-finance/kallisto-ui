 import React from "react";
import { useConnectedWallet } from "@terra-money/wallet-provider";

import ConnectWalletButton from "components/ConnectWalletButton";

import cn from "classnames";

const ConnectionMask = ({ className = "" }) => {
  const connectedWallet = useConnectedWallet();

  return connectedWallet ? null : (
    <div className={cn("connection-mask-container", className)}>
      <img src="/assets/kallisto.png" />
      <span>
        Decentralized Liquidations for
        <br />
        the Rest of Us
      </span>
      <ConnectWalletButton className="connect-wallet-button" />
    </div>
  );
};

export default ConnectionMask;
