import React from "react";

import cn from "classnames";

const AmountView = ({
  label = "",
  value = "",
  highlight = false,
  icon = "",
  background = false,
  vertical = false,
  ...props
}) => (
  <div
    className={cn("amount-view-container", {
      vertical,
      background,
      icon: icon !== "",
    })}
  >
    {label !== "" && <span className="amount-view-label">{label}</span>}
    {icon !== "" && <img className="amount-view-icon" src={icon} />}
    <span
      className={cn("amount-view-value", { highlight, vertical })}
      style={{ ...props.style }}
    >
      {value}
    </span>
  </div>
);

export default AmountView;
