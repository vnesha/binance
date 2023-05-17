import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchData } from "./fetchData";

export function useAccount(): UseQueryResult<any, Error | null> {
  return useQuery({
    queryKey: ["account"],
    queryFn: async () => {
      try {
        const account = await fetchData(
          "https://fapi.binance.com/fapi/v2/account"
        );
        const usdtAsset = account.assets.find(
          (asset) => asset.asset === "USDT"
        );

        if (!usdtAsset) {
          throw new Error("USDT asset not found in account");
        }

        return {
          maintMargin: usdtAsset.maintMargin,
          marginBalance: usdtAsset.marginBalance,
        };
      } catch (error) {
        console.error(error);
        throw new Error(
          "An error occurred while retrieving account information."
        );
      }
    },
    staleTime: 5000,
  });
}
