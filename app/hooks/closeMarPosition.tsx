import { useMutation, useQueryClient, QueryCache } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/util/cryptoConfig";
import { postData } from "./postData";

const closePosition = async ({
  symbol,
  quantity,
}: {
  symbol: string;
  quantity: number;
}) => {
  const BASE_URL = `${API_URL}/fapi/v1/order`;
  const side = quantity >= 0 ? "SELL" : "BUY";

  const params = {
    symbol: symbol,
    side: side,
    type: "MARKET",
    quantity: Math.abs(quantity),
    timestamp: Date.now(),
  };

  const config = postData(params);

  const response = await axios.post(BASE_URL, null, config);
  return response.data;
};

export const useClosePosition = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(closePosition, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["position"] });

      console.log("Position closed successfully", data);
    },
    onError: (error) => {
      console.error("Error closing position", error);
    },
  });

  return mutation;
};
