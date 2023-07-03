import axios from "axios";
import { API_URL } from "@/util/cryptoConfig";
import { postData } from "./usePostData";

export const openOrder = async ({
  symbol,
  quantity,
}: {
  symbol: string;
  quantity: number;
}) => {
  const BASE_URL = `${API_URL}/fapi/v1/order`;

  const params = {
    symbol: symbol,
    side: "BUY",
    type: "MARKET",
    quantity: Math.abs(quantity),
    timestamp: Date.now(),
  };

  const config = postData(params);

  try {
    const response = await axios.post(BASE_URL, null, config);
    return response.data;
  } catch (error) {
    console.error("Error opening position", error);
    throw error; // Dodajte ovu liniju da biste prosledili grešku dalje
  }
};
