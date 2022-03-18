import React from "react";

import Liquidity from "containers/liquidity";
import { UkraineBanner } from "components/Banner";

export default function Home({ state, router }) {
  return (
    <div className="page-container">
      <UkraineBanner />
      <Liquidity />
    </div>
  );
}
