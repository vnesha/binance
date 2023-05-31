import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/util/cryptoConfig";
import { postData } from "./postData";

const openOrder = async ({
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
