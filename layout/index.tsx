import React, { useReducer, useEffect } from 'react'
import Head from 'next/head'

import ConnectWalletButton from 'components/ConnectWalletButton'

import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export default function Layout({
  children,
  router,
  defaultNetwork,
  walletConnectChainIds,
}) {

  return (
    <>
      <Head>
        <title>Kallisto</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      </Head>

      <main className='layout-container'>
        <header className='layout-container__header'>
          <div className="layout-container__header__logo">
            <a href="/"><img className="" src="/assets/logo.png" alt="Kallisto" /></a>
          </div>
          <div className="layout-container__header__buttons">
            <a href="https://t.me/kallistofinance" className="join-telegram-community" target="_blank">
              <span>Join our Community</span>
              <img src="/assets/social/telegram.png" alt="telegram" />
            </a>
            <ConnectWalletButton />
          </div>
        </header>
        {(
          React.cloneElement(children, {
            router,
            defaultNetwork,
            walletConnectChainIds,
          })
        )}
      </main>
      <NotificationContainer />
    </>
  )
}
