import React from "react";

import cn from "classnames";

const AmountView = ({
  label = "",
  value = "",
  highlight = false,
  icon = "",
  background = false,
  vertical = false,
  iconBack = false,
  containerStyle = {},
  button = null,
  theme = "default",
  ...props
}) => (
  <div
    className={cn("amount-view-container", theme, {
      vertical,
      background,
      icon: icon !== "",
    })}
    style={{ ...containerStyle }}
  >
    {label !== "" && <span className={cn("amount-view-label", theme)}>{label}</span>}
    {(icon !== "" && !iconBack) && <img className="amount-view-icon" src={icon} />}
    <span
      className={cn("amount-view-value", { highlight, vertical })}
      style={{ ...props.style }}
    >
      {value}
    </span>
    {(icon !== "" && iconBack) && <img className="amount-view-icon" src={icon} style={{ width: 31, height: 31, marginLeft: 5 }}/>}
    {button}
  </div>
);

export default AmountView;
