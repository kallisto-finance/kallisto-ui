import React from "react";
import { useConnectedWallet } from "@terra-money/wallet-provider";

import ConnectWalletButton from "components/ConnectWalletButton";

const ConnectionMask = () => {
  const connectedWallet = useConnectedWallet();

  return connectedWallet ? null : (
    <div className="connection-mask-container">dfsdf</div>
  );
};

export default ConnectionMask;
