import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { API_URL } from "@/util/cryptoConfig";
import { postData } from "./usePostData";
import { AxiosError } from "../types/types";

export const cancelAllOpenOrders = async ({ symbol }: { symbol: string }) => {
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
      console.log("All orders canceled successfully", data);
    },
    onError: (error: AxiosError) => {
      let errorMsg = error.message; // default error message
      
      if (error.response && error.response.data) {
        const serverError = error.response.data;
        errorMsg = `${serverError.msg}`;
      }
      console.error("Error closing position", errorMsg);

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
