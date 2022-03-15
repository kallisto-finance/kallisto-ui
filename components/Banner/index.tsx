import React from "react";
import Link from 'next/link'

const AttentionBanner = () => (
  <div className="attention-banner-container">
    <img className="attention-banner-icon" src="/assets/danger.png" />
    <span className="attention-banner-text">
      Atention! Kallisto’s smart contracts are not audited. Use at your own
      risk.
    </span>
  </div>
);

const UkraineBanner = () => (
  <div className="ukraine-container-wrapper">
    <Link href="/ukraine">
      <div className="ukraine-container">
        <img className="ukraine-icon" src="/assets/ukraine.png" />
        <div className="banner-content">
          <p className="title">Let’s support Ukraine!</p>
          <p className="content">
            Kallisto donates <span className="donate">$50</span> to Ukraine for
          every $10.000 deposited into the Liquidation Pool.
        </p>
        </div>
      </div>
    </Link>
  </div>
);

const DeFiBanner = () => (
  <div className="defi-banner-container">
    <img className="defi-banner-defi" src="/assets/defi.png" />
    <span className="defi-banner-text"><b>Liquidation Pools</b><br />for <b>Collateral Markets</b></span>
    <img className="defi-banner-bear" src="/assets/logo-fish.png" />
  </div>
);

export { AttentionBanner, DeFiBanner, UkraineBanner };
