import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/util/cryptoConfig";
import { postData } from "./usePostData";
import { toast } from "react-toastify";
import { AxiosError } from "../types/types";
import { formatOrderType } from "@/util/formatOrderType";
import axios from "axios";

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

  return {
    data: response.data,
    side: side
  };
};

export const useClosePosition = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(closePosition, {
    onSuccess: ({ data, side }) => {
      queryClient.invalidateQueries({ queryKey: ["position"] });
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
      console.log("Position closed successfully", data);
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
