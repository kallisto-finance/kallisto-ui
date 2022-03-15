import {
  getChainOptions,
  StaticWalletProvider,
  WalletControllerChainOptions,
  WalletProvider,
} from "@terra-money/wallet-provider";

import { AppProps } from "next/app";
import Layout from "layout";

import { DEFAULT_NETWORK } from "../utils/constants";

import "../styles/index.scss";

const allowedNetworks = [DEFAULT_NETWORK];

function App({
  Component,
  defaultNetwork,
  walletConnectChainIds,
  router,
}: AppProps & WalletControllerChainOptions) {
  return typeof window !== "undefined" ? (
    <WalletProvider
      defaultNetwork={defaultNetwork}
      walletConnectChainIds={walletConnectChainIds}
    >
      <Layout
        router={router}
        defaultNetwork={defaultNetwork}
        walletConnectChainIds={walletConnectChainIds}
      >
        <Component />
      </Layout>
    </WalletProvider>
  ) : (
    <StaticWalletProvider defaultNetwork={defaultNetwork}>
      <Layout
        router={router}
        defaultNetwork={defaultNetwork}
        walletConnectChainIds={walletConnectChainIds}
      >
        <Component />
      </Layout>
    </StaticWalletProvider>
  );
}

App.getInitialProps = async () => {
  const chainOptions = await getChainOptions();
  return {
    ...chainOptions,
  };
};

export default App;
