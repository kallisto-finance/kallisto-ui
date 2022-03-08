import { useState, useEffect } from "react";
import {
  MsgSend,
  MnemonicKey,
  Coins,
  LCDClient,
  WasmAPI,
} from "@terra-money/terra.js";
import {
  useWallet,
  WalletStatus,
  ConnectType,
  useConnectedWallet,
} from "@terra-money/wallet-provider";
import BigNumber from "bignumber.js";

import { formatBalance, getContractQuery, getBalance } from "utils/wasm";
import { addresses } from "utils/constants";

const usePool = () => {
  const { network } = useWallet();
  const connectedWallet = useConnectedWallet();

  const [totalLiquidity, setTotalLiquidity] = useState(new BigNumber(0));
  const [myLiquidity, setMyLiquidity] = useState(new BigNumber(0));
  const [poolShare, setPoolShare] = useState(new BigNumber(0))

  const fetchPoolValues = async () => {
    // Get User Balance
    let res = await getBalance(
      addresses[network.chainID].contracts.kallistoPool.address,
      connectedWallet.walletAddress,
      network.chainID
    );
    setMyLiquidity(new BigNumber(res['balance']))

    // Get Total Liquidity
    res = await getContractQuery(
      addresses[network.chainID].contracts.kallistoPool.address,
      network.chainID,
      {
        total_cap: {}
      }
    );
    setTotalLiquidity(new BigNumber(res["total_cap"]));

    // Get PoolInfo
    res = await getContractQuery(
      addresses[network.chainID].contracts.kallistoPool.address,
      network.chainID,
      {
        get_info: {},
      }
    );
    const totalSupply = new BigNumber(res["total_supply"]);
    setPoolShare(myLiquidity.dividedBy(totalSupply).multipliedBy(100))
  };

  useEffect(() => {
    if (connectedWallet && network) {
      fetchPoolValues();
    }
  }, [network, connectedWallet]);

  return {
    totalLiquidity,
    myLiquidity,
    poolShare,
    fetchPoolValues,
  };
};

export default usePool;
