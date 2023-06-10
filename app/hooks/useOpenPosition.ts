import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/util/cryptoConfig";
import { postData } from "./usePostData";
import { toast } from "react-toastify";

const openOrder = async ({
  symbol,
  quantity,
  side,
  type = 'MARKET',
  price = null,
  stopLossPrice = null,
  takeProfitPrice = null,
}: {
  symbol: string;
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

  return response.data;
};

export const useOpenOrder = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(openOrder, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["position"] });
      queryClient.invalidateQueries({ queryKey: ["openOrders"] });
      toast.success("Order Submitted", {
        position: "bottom-right",
        // transition: Flip,
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      console.log("Position opened successfully", data);
    },
    onError: (error) => {
      console.error("Error opening position", error);
    },
  });

  return mutation;
};
