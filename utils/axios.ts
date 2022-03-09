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

const getTxHistories = (address, offset = 0, limit = 100) => 
  axiosClient().get(`https://fcd.terra.dev/v1/txs?offset=${offset}&limit=${limit}&account=${address}`)

export { getGasPrices, getTxHistories };
