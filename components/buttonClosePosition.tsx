import { useClosePosition } from "@/hooks/useCloseMarkPosition";
import { useCancelAllOpenOrders } from "@/hooks/useCancelAllOpenOrders";

type buttonClosePositionProps = {
  symbol: string;
  quantity: number;
};

export default function buttonClosePosition({
  symbol,
  quantity,
}: buttonClosePositionProps) {
  const closePositionMutation = useClosePosition();
  const cancelAllOpenOrders = useCancelAllOpenOrders();

  const handleCloseClick = () => {
    closePositionMutation.mutate({ symbol, quantity });
    cancelAllOpenOrders.mutate({ symbol });
  };

  return (
    <button
      onClick={handleCloseClick}
      disabled={closePositionMutation.isLoading}
    >
      {/* {closePositionMutation.isLoading ? "Closing..." : "Close Position"} */}
      Market
    </button>
  );
}
