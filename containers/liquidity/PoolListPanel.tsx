import React from "react";
import BigNumber from "bignumber.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

import ViewContainer from "components/ViewContainer";

import VaultPool from "components/VaultPool";

const PoolListPanel = ({ pools, deposits, onSelectPool }) => {
  return (
    <>
      <div className="select-liquidity-arrow">
        <span>Select a Liquidation Pool</span>
        <FontAwesomeIcon icon={faArrowDown as IconProp} />
      </div>
      <ViewContainer className="pool-list-panel" header={false}>
        <div className="pool-list-wrapper">
          {pools.map((pool, index) => (
            <VaultPool
              pool={pool}
              deposits={deposits.length > 0 ? deposits[index].deposits : new BigNumber(0)}
              key={`valut-pool-${pool.name}`}
              onSelectPool={(id) => onSelectPool(id)}
            />
          ))}
        </div>
      </ViewContainer>
    </>
  );
};

export default PoolListPanel;
