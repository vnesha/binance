import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/util/cryptoConfig";
import { postData } from "./usePostData";
import { toast } from "react-toastify";
import { AxiosError } from "../types/types";
import { formatOrderType } from "@/util/formatOrderType";
import axios from "axios";

const openOrder = async ({
  symbol,
  quantity,
  side,
  type = 'MARKET',
  price = null,
  stopLossPrice = null,
  takeProfitPrice = null,
}: {
  symbol: string | null;
  quantity: number;
  side: 'BUY' | 'SELL';
  type?: 'MARKET' | 'LIMIT';
  price?: number | null;
  stopLossPrice?: number | null;
  takeProfitPrice?: number | null;
}) => {
  const BASE_URL = `${API_URL}/fapi/v1/order`;

  const params: any = {
    symbol: symbol,
    side: side,
    type: type,
    quantity: Math.abs(quantity),
    timestamp: Date.now(),
  };

  // Add price and timeInForce to params if order type is 'LIMIT'
  if (type === 'LIMIT' && price) {
    params.price = price;
    params.timeInForce = 'GTC'; // Good Till Cancelled
  }

  const config = postData(params);

  const response = await axios.post(BASE_URL, null, config);
  console.log("Position opened successfully", response.data);

  // If stopLossPrice is provided, send a separate STOP_MARKET order
  if (stopLossPrice) {
    const stopMarketParams = {
      symbol: symbol,
      side: side === 'BUY' ? 'SELL' : 'BUY', 
      type: 'STOP_MARKET',
      quantity: Math.abs(quantity),
      timestamp: Date.now(),
      stopPrice: stopLossPrice,
      // price: price,
      // closePosition: true,
      // reduceOnly: true,

    };

    const stopMarketConfig = postData(stopMarketParams);
    const stopMarketResponse = await axios.post(BASE_URL, null, stopMarketConfig);
    console.log("Stop Loss order created successfully", stopMarketResponse.data);
  }

  // If takeProfitPrice is provided, send a separate TAKE_PROFIT_MARKET order
  if (takeProfitPrice) {
    const takeProfitMarketParams = {
      symbol: symbol,
      side: side === 'BUY' ? 'SELL' : 'BUY', 
      type: 'TAKE_PROFIT',
      quantity: Math.abs(quantity),
      timestamp: Date.now(),
      stopPrice: takeProfitPrice,
      price: price,
      //closePosition: true,
      // reduceOnly: true,
    };

    const takeProfitMarketConfig = postData(takeProfitMarketParams);
    const takeProfitMarketResponse = await axios.post(BASE_URL, null, takeProfitMarketConfig);
    console.log("Take Profit order created successfully", takeProfitMarketResponse.data);
  }

  return {
    data: response.data,
    side: side
  };
};

export const useOpenOrder = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(openOrder, {
    onSuccess: ({ data, side }) => {
      queryClient.invalidateQueries({ queryKey: ["position"] });
      queryClient.invalidateQueries({ queryKey: ["openOrders"] });
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
    },

    onError: (error: AxiosError) => {
      let errorMsg = error.message; // default error message
      
      if (error.response && error.response.data) {
        const serverError = error.response.data;
        errorMsg = `${serverError.msg}`;
      }
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
    },
  });

  return mutation;
};
