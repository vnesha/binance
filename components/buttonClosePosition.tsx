import { useClosePosition } from "@/app/hooks/useCloseMarkPosition";

type buttonClosePositionProps = {
  symbol: string;
  quantity: number;
};

export default function buttonClosePosition({
  symbol,
  quantity,
}: buttonClosePositionProps) {
  const closePositionMutation = useClosePosition();

  const handleCloseClick = () => {
    closePositionMutation.mutate({ symbol, quantity });
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
