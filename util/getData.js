const axios = require('axios')

// const IS_PRODUCTION = process.env.NEXT_PUBLIC_NODE_ENV === "production";

// const API_URL = IS_PRODUCTION
//   ? process.env.NEXT_PUBLIC_API_URL
//   : process.env.NEXT_PUBLIC_TEST_API_URL;

// const API_KEY = IS_PRODUCTION
//   ? process.env.NEXT_PUBLIC_API_KEY
//   : process.env.NEXT_PUBLIC_TEST_API_KEY;

// const SECRET_KEY = IS_PRODUCTION
//   ? process.env.NEXT_PUBLIC_SECRET_KEY
//   : process.env.NEXT_PUBLIC_TEST_SECRET_KEY;

// const cryptosha256 = require("crypto");

// function generateSignature(
//   queryString,
//   SECRET_KEY
// ) {
//   return cryptosha256
//     .createHmac("sha256", SECRET_KEY)
//     .update(queryString)
//     .digest("hex");
// }

// const getServerTime = async () => {
//   const {
//     data: { serverTime },
//   } = await axios.get("https://fapi.binance.com/fapi/v1/time");
//   return serverTime;
// };

// const getQueryString = async () => {
//   const timestamp = await getServerTime();
//   return `timestamp=${timestamp}&recvWindow=5000`;
// };

// const getQueryStringPost = async () => {
//   const timestamp = await getServerTime();
//   return `timestamp=${timestamp}`;
// };

// async function fetchData(url) {
//   console.log('fetchData: Početak za URL', url);
//   const queryString = await getQueryString();
//   const signature = generateSignature(queryString, SECRET_KEY);

//   const { data } = await axios.get(
//     `${url}?${queryString}&signature=${signature}`,
//     {
//       headers: {
//         "Content-Type": "application/json",
//         "X-MBX-APIKEY": API_KEY,
//       },
//     }
//   );

//   console.log('fetchData: Podaci dobijeni za URL', url);
//   return data;
// }


// async function getOpenOrders() {
//   const urlOpenOrders = `${API_URL}/fapi/v2/positionRisk`;
//   console.log('getOpenOrders: Početak');

//   try {
//     const accountOpenOrders = await fetchData(urlOpenOrders);
//     console.log('getOpenOrders: Podaci dobijeni');
//     return accountOpenOrders;
//   } catch (error) {
//     console.error('getOpenOrders: Greška', error);
//     throw error;
//   }
// }

async function getPremiumIndex(symbol) {
  const urlPremiumIndex = `http://localhost:8080/binance/fapi/v1/premiumIndex?symbol=${symbol.toUpperCase()}`;

  try {
    const response = await fetch(urlPremiumIndex);
    const data = await response.json();
    // console.log('getPremiumIndex: Podaci dobijeni za simbol', symbol, 'Podaci:', data);
    return data.markPrice;
  } catch (error) {
    console.error('getPremiumIndex: Greška za simbol', symbol, error);
    throw error;
  }
}

module.exports = { getPremiumIndex };
