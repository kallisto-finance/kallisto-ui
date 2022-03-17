import React from "react";
import Link from "next/link";

const Ukraine = () => {
  return (
    <div className="page-container">
      <div className="ukraine-page-container">
        <Link href="/">
          <div className="ukraine-page-back">
            <img src="/assets/left-arrow-white.png" />
            Go Back
          </div>
        </Link>
        <div className="ukraine-page-banner">
          <div className="ukraine-container">
            <img className="ukraine-icon" src="/assets/ukraine.png" />
            <div className="banner-content">
              <h1 className="title">Let’s support Ukraine!</h1>
              <p className="content">
                Kallisto donates <span className="donate">$50</span> to Ukraine
                for every $10,000 deposited into the Liquidation Pool.
              </p>
            </div>
          </div>
        </div>
        <div className="ukraine-page-content">
          <h2 className="ukraine-page-title">
            How I support Ukraine with Kallisto?
          </h2>
          <ol className="ukraine-page-description">
            <li>
              <p>Deposit UST in our bLUNA Liquidation Pool</p>
            </li>
            <li>
              <p>
                Kallisto for every <b>$10,000</b> UST deposited will donate{" "}
                <span style={{ color: "#efce2b", fontWeight: 500 }}>$50</span>{" "}
                UST to{` `}
                <a
                  href="https://unchain.fund/"
                  target="_blank"
                  style={{ color: "#fff" }}
                >
                  https://unchain.fund/
                </a>
                {` `}. Unchain is a charity project created by blockchain
                activists to support Ukraine with humanitarian aid.
              </p>
            </li>
            <li>
              <p>
                <b>Every Wednesday</b> the Kallisto team will deposit the
                collected to Unchain Fund Ethereum wallet adress{` `}
                <a
                  href="https://etherscan.io/address/0x10E1439455BD2624878b243819E31CfEE9eb721C"
                  target="_blank"
                  style={{ color: "#efce2b" }}
                >
                  0x10E1439455BD2624878b243819E31CfEE9eb721C
                </a>
              </p>
            </li>
          </ol>
          <div className="ukraine-amount-view">
            <div className="ukraine-amount-value">
              <span>50 UST</span>
              <img src="/assets/tokens/ust.png" />
            </div>
            <span>Raised this week</span>
          </div>
          <div className="ukraine-amount-view">
            <div className="ukraine-amount-value">
              <span>100 ETH</span>
              <img src="/assets/tokens/eth.png" />
            </div>
            <span>Total Raised</span>
          </div>
        </div>
        <Link href="/">
          <div className="ukraine-page-button">Suport Ukraine</div>
        </Link>
      </div>
    </div>
  );
};

export default Ukraine;
