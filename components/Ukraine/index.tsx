import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const faPropIcon = faTimes as IconProp;

const Ukraine = () => (
  <div className="ukraine-container-wrapper">
    <div className="ukraine-container">
      <img className="ukraine-icon" src="/assets/ukraine.png" />
      <div className="banner-content">
        <p className="title">Help to Ukraine!</p>
        <p className="content">
          Kallisto contributes <span className="donate">$50</span> for Ukraine
          for every $10.000 deposited that is made into the Liquidation Pool.
        </p>
      </div>
    </div>
  </div>
);

export default Ukraine;
