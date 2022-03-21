import React from "react";

import Liquidity from "containers/liquidity";

export default function Home({ state, router }) {
  return (
    <div className="page-container">
      <Liquidity />
    </div>
  );
}
