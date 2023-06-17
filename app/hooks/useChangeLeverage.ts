import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/util/cryptoConfig";
import { postData } from "./usePostData";
import { toast } from "react-toastify";
import { AxiosError } from "../types/types";
import axios from "axios";

const changeLeverage = async ({
  symbol,
  leverage,
}: {
  symbol: string;
  leverage: number;
}) => {
    const BASE_URL = `${API_URL}/fapi/v1/leverage`;
  
    const params = {
      symbol: symbol,
      leverage: leverage,
      timestamp: Date.now(),
    };
  
    const config = postData(params);
  
    const response = await axios.post(BASE_URL, null, config);
    return response.data;
  };
  
  export const useChangeLeverage = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation(changeLeverage, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["position"] });
        setTimeout(() => {
          toast.success("Leverage adjustment successful", {
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
        console.log("Leverage adjustment successful", data);
      },

      onError: (error: AxiosError) => {
        let errorMsg = error.message; // default error message
        
        if (error.response && error.response.data) {
          const serverError = error.response.data;
          errorMsg = `${serverError.msg}`;
        }
        console.error("Error Leverage adjustment", errorMsg);
        
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
  