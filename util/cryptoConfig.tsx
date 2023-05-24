import axios from "axios";

declare let process: {
  env: {
    NEXT_PUBLIC_API_KEY: string;
    NEXT_PUBLIC_SECRET_KEY: string;
    NEXT_PUBLIC_TEST_API_KEY: string;
    NEXT_PUBLIC_TEST_SECRET_KEY: string;
    NEXT_PUBLIC_NODE_ENV: string;
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_TEST_API_URL: string;
  };
};

const IS_PRODUCTION = process.env.NEXT_PUBLIC_NODE_ENV === "production";

export const API_URL = IS_PRODUCTION
  ? process.env.NEXT_PUBLIC_API_URL
  : process.env.NEXT_PUBLIC_TEST_API_URL;

export const API_KEY = IS_PRODUCTION
  ? process.env.NEXT_PUBLIC_API_KEY
  : process.env.NEXT_PUBLIC_TEST_API_KEY;

export const SECRET_KEY = IS_PRODUCTION
  ? process.env.NEXT_PUBLIC_SECRET_KEY
  : process.env.NEXT_PUBLIC_TEST_SECRET_KEY;

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

export const getQueryStringPost = async () => {
  const timestamp = await getServerTime();
  return `timestamp=${timestamp}`;
};
