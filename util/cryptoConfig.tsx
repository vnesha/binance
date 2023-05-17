import axios from "axios";

declare let process: {
  env: {
    REACT_APP_API_KEY: string;
    REACT_APP_SECRET_KEY: string;
  };
};

export const API_KEY = process.env.REACT_APP_API_KEY;
export const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

export const getServerTime = async () => {
  const {
    data: { serverTime },
  } = await axios.get("https://fapi.binance.com/fapi/v1/time");
  return serverTime;
};

export const getQueryString = async () => {
  const timestamp = await getServerTime();
  return `timestamp=${timestamp}&recvWindow=5000`;
};
