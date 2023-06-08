import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/util/cryptoConfig";
import { postData } from "./usePostData";


const cancelOrder = async ({
    symbol,
    orderId,
  }: {
    symbol: string;
    orderId: number;
  }) => {
    const BASE_URL = `${API_URL}/fapi/v1/order`;
  
    const params = {
      symbol: symbol,
      orderId: orderId,
      timestamp: Date.now(),
    };
  
    const config = postData(params);
  
    const response = await axios.delete(BASE_URL, config);
    return response.data;
  };
  
  export const useCancelOrder = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation(cancelOrder, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["openOrders"] });
  
        console.log("Order canceled successfully", data);
      },
      onError: (error) => {
        console.error("Error canceling order", error);
      },
    });
  
    return mutation;
  };
  