import axios from "axios";

const axiosClient = () => {
  const client = axios.create();

  client.defaults.headers.common = {
    "Access-Control-Allow-Origin": "*",
  };

  return client;
};

const getGasPrices = () =>
  axiosClient().get("https://bombay-fcd.terra.dev/v1/txs/gas_prices");

export { getGasPrices };
