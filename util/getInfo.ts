import { fetchData } from "@/hooks/useFetchData";

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
    const urlPremiumIndex = `${API_URL}/fapi/v1/premiumIndex?symbol=${symbol.toUpperCase()}&timestamp=...`
  
    try {
      const premiumIndex = await fetchData(urlPremiumIndex);
      return premiumIndex.markPrice;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  