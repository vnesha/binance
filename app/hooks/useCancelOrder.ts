import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/util/cryptoConfig";
import { postData } from "./usePostData";
import { toast } from "react-toastify";
import { AxiosError } from "../types/types";
import { formatOrderType } from "@/util/formatOrderType";
import axios from "axios";

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
        const { origType, side } = data;
        queryClient.invalidateQueries({ queryKey: ["openOrders"] });
        setTimeout(() => {
          toast.warn(`${formatOrderType(origType)} ${formatOrderType(side)} Order Canceled`, {
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
        console.log("Order canceled successfully", data);
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
  