import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const faPropIcon = faTimes as IconProp;

const Banner = () => {
  const [show, setShow] = useState(true);

  return show ? (
    <div className="banner-container">
      <img className="banner-icon" src="/assets/danger.png" />
      <span className="banner-text">
        Atention! Kallisto’s smart contracts are not audited. Use at your own
        risk.
      </span>
      <div className="banner-close" onClick={(e) => setShow(false)}>
        <FontAwesomeIcon icon={faPropIcon} />
      </div>
    </div>
  ) : null;
};

export default Banner;
