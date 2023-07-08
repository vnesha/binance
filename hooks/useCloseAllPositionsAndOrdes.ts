import axios from 'axios';
import { toast } from "react-toastify";
import { formatOrderType } from "@/util/formatOrderType";
import { postData } from './usePostData';
import { API_URL } from "@/util/cryptoConfig";

export const closeAllPositionsAndOrders = async (positions: any) => {
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

      // Show toast notification
      toast.success("Order Submitted", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setTimeout(() => {
        toast.warn(`Market ${formatOrderType(side)} Order Filled`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }, 1000);

    } catch (error: any) {
      let errorMsg = error.message; // default error message
      
      if (error.response && error.response.data) {
        const serverError = error.response.data;
        errorMsg = `${serverError.msg}`;
      }
      console.error("Error closing position", errorMsg);

      // Show toast notification
      toast.error(errorMsg, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
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

      // Show toast notification
      toast.warn(`All orders canceled successfully`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

    } catch (error: any) {
      let errorMsg = error.message; // default error message
      
      if (error.response && error.response.data) {
        const serverError = error.response.data;
        errorMsg = `${serverError.msg}`;
      }
      console.error("Error canceling all orders", errorMsg);

      // Show toast notification
      toast.error(errorMsg, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }
};

