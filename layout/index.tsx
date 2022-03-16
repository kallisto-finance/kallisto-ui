import React from 'react'
import Head from 'next/head'

import LayoutHeader from './header'
import Notice from './notice'
import { AttentionBanner } from 'components/Banner'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      <ToastContainer autoClose={10000} />
    </>
  )
}
