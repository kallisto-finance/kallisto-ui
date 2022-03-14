import React, { useReducer, useEffect } from 'react'
import Head from 'next/head'

import LayoutHeader from './header'
import Notice from './notice'
import { AttentionBanner } from 'components/Banner'

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
        <AttentionBanner />
        <LayoutHeader />
        {(
          React.cloneElement(children, {
            router,
            defaultNetwork,
            walletConnectChainIds,
          })
        )}
        <Notice />
      </main>
      <NotificationContainer />
    </>
  )
}
