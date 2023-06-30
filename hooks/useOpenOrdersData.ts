import { useQuery } from "@tanstack/react-query";
import { fetchData } from "./useFetchData";

const queryOptions: any = {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 1000,
  };
  
export function useOpenOrdersData() {
    const API_URL =
    process.env.NEXT_PUBLIC_NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_API_URL
      : process.env.NEXT_PUBLIC_TEST_API_URL;

  const urlopenOrders = () => {
    return fetchData(`${API_URL}/fapi/v1/openOrders`);
  };
  
  const openOrder = useQuery(["openOrders"], urlopenOrders, queryOptions);
  
  return openOrder
};