import { useQuery } from "@tanstack/react-query";
import { fetchData } from "./useFetchData";
import { API_URL } from "@/util/cryptoConfig";

const queryOptions: any = {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 1000,
  };
  
export function useOpenOrdersData() {
  const urlopenOrders = () => {
    return fetchData(`${API_URL}/fapi/v1/openOrders`);
  };
  
  const openOrder = useQuery(["openOrders"], urlopenOrders, queryOptions);
  
  return openOrder
};