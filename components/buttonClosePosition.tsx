import { useClosePosition } from "@/app/hooks/useCloseMarkPosition";
import { useCancelAllOpenOrders } from "@/app/hooks/useCancelAllOpenOrders";

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
      Close Position
    </button>
  );
}
