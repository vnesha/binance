import { fetchData } from "@/hooks/useFetchData";
import { MongoClient } from "mongodb";


const API_URL =
  process.env.NEXT_PUBLIC_NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_TEST_API_URL;

export async function getAccountInfo() {
  const urlAccount = `${API_URL}/fapi/v2/account`;

  try {
    const accountInfo = await fetchData(urlAccount);
    return accountInfo;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getExchangeInfo() {
  const urlExchange = `${API_URL}/fapi/v1/exchangeInfo`;

  try {
    const accountExchange = await fetchData(urlExchange);
    return accountExchange;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getOpenOrders() {
  const urlOpenOrders = `${API_URL}/fapi/v2/positionRisk`;

  try {
    const accountOpenOrders = await fetchData(urlOpenOrders);
    return accountOpenOrders;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getPremiumIndex(symbol: string) {
  const urlPremiumIndex = `${API_URL}/fapi/v1/premiumIndex?symbol=${symbol.toUpperCase()}&timestamp=...`;

  try {
    const premiumIndex = await fetchData(urlPremiumIndex);
    return premiumIndex.markPrice;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export type Settings = {
  _id: string;
  riskPrecent: number;
  riskRewardRatio: number;
};

export const getSettings = async () => {
  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  const mongoClient = await MongoClient.connect(MONGODB_URI);

  try {
    const data = await mongoClient
      .db("BinanceDB")
      .collection("Settings")
      .find({})
      .toArray();

    return data;
  } catch (error) {
    console.error("Failed to fetch settings from MongoDB", error);
    throw error;
  } finally {
    await mongoClient.close();
  }
};
