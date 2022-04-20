import React from "react";
import ReactTooltip from "react-tooltip";

import cn from "classnames";
import { formatBalance } from "utils/wasm";
import { compare } from "utils/number";
import { getWalletAddressEllipsis } from "utils/common";

const VaultPool = ({ pool, deposits, onSelectPool }) => {
  const { id, name, category, icon, theme, apy, totalCap, userCap, address } =
    pool;

  return (
    <div
      className={cn("vault-pool-container", theme, {
        disabled: address === "",
      })}
      onClick={(e) => {
        if (address === "") {
          return;
        }
        onSelectPool(id);
      }}
    >
      <div className={cn("pool-name-wrapper", theme)}>
        <img src={icon} data-tip={pool.address} />
        <div className="pool-name">
          <div className="pool-name-text">{name}</div>
          <div className={cn("pool-name-category", theme)}>{category}</div>
        </div>
      </div>
      <div className={cn("pool-values-wrapper", theme)}>
        <div className={cn("value-item", "apy", theme)}>
          <div className={cn("value-item-name", theme)}>APY</div>
          <div className="value-item-value">{apy} %</div>
        </div>
        <div className={cn("value-item", theme)}>
          <div className={cn("value-item-name", theme)}>7 day Deposits</div>
          <div className="value-item-value">
            {formatBalance(deposits, 0)} UST
          </div>
        </div>
        <div className={cn("value-item", theme)}>
          <div className={cn("value-item-name", theme)}>Liquidity</div>
          <div className="value-item-value">{`${formatBalance(
            totalCap
          )} UST`}</div>
        </div>
      </div>
      {compare(userCap, 0) > 0 && (
        <div className="pool-active-wrapper">
          <img src="/assets/active.png" />
          Active Pool
          <span>{`${formatBalance(userCap)} UST`}</span>
        </div>
      )}
      <ReactTooltip
        effect="solid"
        multiline={true}
        backgroundColor="#FFF"
        delayHide={1000}
        clickable={true}
        isCapture={true}
        getContent={(dataTip) =>
          dataTip ? (
            <div
              className="pool-tooltip"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <img src="/assets/link.svg" />
              <a
                href={`https://terrasco.pe/mainnet/address/${dataTip}`}
                target="_blank"
              >
                {getWalletAddressEllipsis(dataTip, 15, 15)}
              </a>
            </div>
          ) : null
        }
      ></ReactTooltip>
    </div>
  );
};

export default VaultPool;
