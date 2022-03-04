import React, { useReducer, useEffect } from 'react'
import Head from 'next/head'

import LayoutHeader from './header'
import Notice from './notice'
import Banner from 'components/Banner'
import Ukraine from 'components/Ukraine'

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
        <Banner />
        <LayoutHeader />
        <Ukraine />
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
