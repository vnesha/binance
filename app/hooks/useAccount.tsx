import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchData } from "./fetchData";

type AccountType = {
  asset: string;
};

export function useAccount(): UseQueryResult<any, Error | null> {
  const API_URL =
    process.env.NEXT_PUBLIC_NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_API_URL
      : process.env.NEXT_PUBLIC_TEST_API_URL;

  return useQuery({
    queryKey: ["account"],
    queryFn: async () => {
      try {
        const account = await fetchData(`${API_URL}/fapi/v2/account`);

        const usdtAsset = account.assets.find(
          (asset: AccountType) => asset.asset === "USDT"
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
    staleTime: 1000,
  });
}
