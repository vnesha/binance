import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchData } from "./fetchData";

export function useCryptoPositions(): UseQueryResult<any, Error | null> {
  return useQuery({
    queryKey: ["positions"],
    queryFn: async () => {
      try {
        const position = await fetchData(
          "https://fapi.binance.com/fapi/v2/positionRisk"
        );
        return position;
      } catch (error) {
        console.error(error);
        throw new Error("An error occurred while retrieving positions.");
      }
    },
  });
}
