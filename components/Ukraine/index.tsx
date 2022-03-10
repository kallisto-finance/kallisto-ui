import React from "react";

const Ukraine = () => (
  <div className="ukraine-container-wrapper">
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
  </div>
);

export default Ukraine;
