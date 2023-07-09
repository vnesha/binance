import axios from 'axios';
import { PositionType } from "../types/types";
import { postData } from '@/hooks/usePostData';
import { API_URL } from "@/util/cryptoConfig";

export const closeAllPositionsAndOrders = async (positions: PositionType[]) => {
  for (const position of positions) {
    // Close position
    const BASE_URL = `${API_URL}/fapi/v1/order`;
    const side = position.positionAmt >= 0 ? "SELL" : "BUY";

    const params = {
      symbol: position.symbol,
      side: side,
      type: "MARKET",
      quantity: Math.abs(position.positionAmt),
      timestamp: Date.now(),
    };

    const config = postData(params);

    try {
      const response = await axios.post(BASE_URL, null, config);
      console.log("Position closed successfully", response.data);
    } catch (error: any) {
      let errorMsg = error.message; // default error message
      
      if (error.response && error.response.data) {
        const serverError = error.response.data;
        errorMsg = `${serverError.msg}`;
      }
      console.error("Error closing position", errorMsg);
    }

    // Cancel all open orders for the position
    const ORDER_BASE_URL = `${API_URL}/fapi/v1/allOpenOrders`;

    const orderParams = {
      symbol: position.symbol,
      timestamp: Date.now(),
    };

    const orderConfig = postData(orderParams);

    try {
      const response = await axios.delete(ORDER_BASE_URL, orderConfig);
      console.log("All orders canceled successfully", response.data);
    } catch (error: any) {
      let errorMsg = error.message; // default error message
      
      if (error.response && error.response.data) {
        const serverError = error.response.data;
        errorMsg = `${serverError.msg}`;
      }
      console.error("Error canceling all orders", errorMsg);
    }
  }
};
