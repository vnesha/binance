import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/util/cryptoConfig";
import { postData } from "./usePostData";

const cancelAllOpenOrders = async ({ symbol }: { symbol: string }) => {
  const BASE_URL = `${API_URL}/fapi/v1/allOpenOrders`;

  const params = {
    symbol: symbol,
    timestamp: Date.now(),
  };

  const config = postData(params);

  const response = await axios.delete(BASE_URL, config);
  return response.data;
};

export const useCancelAllOpenOrders = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(cancelAllOpenOrders, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["openOrders"] });

      console.log("All orders canceled successfully", data);
    },
    onError: (error) => {
      console.error("Error canceling all orders", error);
    },
  });

  return mutation;
};
