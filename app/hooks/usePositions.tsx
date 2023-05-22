import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchData } from "./fetchData";

export function useCryptoPositions(): UseQueryResult<any, Error | null> {
  const API_URL =
    process.env.NEXT_PUBLIC_NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_API_URL
      : process.env.NEXT_PUBLIC_TEST_API_URL;

  return useQuery({
    queryKey: ["positions"],
    queryFn: async () => {
      try {
        const position = await fetchData(`${API_URL}/fapi/v2/positionRisk`);

        return position;
      } catch (error) {
        console.error(error);

        throw new Error("An error occurred while retrieving positions.");
      }
    },
    staleTime: 1000,
  });
}
