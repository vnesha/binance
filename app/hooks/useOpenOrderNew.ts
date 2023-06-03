import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/util/cryptoConfig";
import { postData } from "./postData";

const openOrder = async ({
  symbol,
  quantity,
  side,
  type = 'MARKET',
  price = null,
}: {
  symbol: string;
  quantity: number;
  side: 'BUY' | 'SELL';
  type?: 'MARKET' | 'LIMIT';
  price?: number | null;
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
  return response.data;
};

export const useOpenOrder = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(openOrder, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["position"] });

      console.log("Position opened successfully", data);
    },
    onError: (error) => {
      console.error("Error opening position", error);
    },
  });

  return mutation;
};
