import React from "react";
import { Doughnut } from "react-chartjs-2";
import { formatBalance } from "utils/wasm";

const DonutChart = ({ donutValues, data }) => {
  return (
    <div className="donut-chart-container">
      <div className="donut-chart-section">
        <Doughnut data={data} width={400} height={400} />
      </div>
      <div className="donut-chart-description">
        <div className="donut-chart-row">
          <div
            className="donut-chart-icon"
            style={{ background: "#B6B2EF" }}
          ></div>
          <div className="donut-chart-value">
            <div className="title" style={{ color: "#B6B2EF" }}>
              Liquid UST Balance
            </div>
            <div className="value">{`${formatBalance(donutValues.ust, 6)} UST`}</div>
          </div>
        </div>
        <div className="donut-chart-row">
          <div
            className="donut-chart-icon"
            style={{ background: "#fff" }}
          ></div>
          <div className="donut-chart-value">
            <div className="title" style={{ color: "#fff" }}>
              UST in Bids
            </div>
            <div className="value">{`${formatBalance(donutValues.ustBid, 6)} UST`}</div>
          </div>
        </div>
        <div className="donut-chart-row">
          <div
            className="donut-chart-icon"
            style={{ background: "#37FAD3" }}
          ></div>
          <div className="donut-chart-value">
            <div className="title" style={{ color: "#37FAD3" }}>
              bLUNA Balance
            </div>
            <div className="value">{`${formatBalance(donutValues.blunaUST, 6)} UST`}</div>
						<div className="value">{`${formatBalance(donutValues.bluna, 6)} bLUNA`}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonutChart;
