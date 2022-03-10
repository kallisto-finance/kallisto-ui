import React from 'react'

import ConnectWalletButton from 'components/ConnectWalletButton'

const LayoutHeader = () => (
  <header className='layout-container__header'>
    <div className="layout-container__header__logo">
      <a href="/"><img className="" src="/assets/logo-2.png" alt="Kallisto" /></a>
    </div>
    <div className="layout-container__header__buttons">
      <a href="/blog" className="header-button" target="_blank">
        <span>Blog</span>
      </a>
      <a href="https://t.me/kallistofinance" className="header-button" target="_blank">
        <span>Join our Community</span>
        <img src="/assets/social/telegram.png" alt="Telegram" />
      </a>
      <ConnectWalletButton />
    </div>
  </header>
)

export default LayoutHeader
