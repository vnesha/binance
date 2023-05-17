import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchData } from "./fetchData";

export function useExchangeInfo(): UseQueryResult<
  Record<string, any>,
  Error | null
> {
  return useQuery({
    queryKey: ["exchangeInfo"],
    queryFn: async () => {
      try {
        const exchangeInfo = await fetchData(
          "https://fapi.binance.com/fapi/v1/exchangeInfo"
        );
        const { symbols } = exchangeInfo;

        // Create a symbol map for easy information retrieval
        const symbolMap: Record<string, any> = {};
        symbols.forEach((symbol: any) => {
          symbolMap[symbol.symbol] = symbol;
        });

        return symbolMap;
      } catch (error) {
        console.error(error);
        throw new Error("An error occurred while retrieving exchange info.");
      }
    },
  });
}
