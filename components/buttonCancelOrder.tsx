import { useCancelOrder } from "@/app/hooks/useCancelOrder";

type CancelButtonProps = {
  symbol: string;
  orderId: number;
};

export default function CancelButton({ orderId, symbol }: CancelButtonProps) {
  const cancelOrder = useCancelOrder();

  const handleCloseClick = () => {
    cancelOrder.mutate({
      symbol: symbol,
      orderId: orderId,
    });
  };

  return (
    <button
      className="flex-shrink-0 flex-grow basis-[70px] text-left"
      onClick={handleCloseClick}
      disabled={cancelOrder.isLoading}
    >
      Cancel Order
    </button>
  );
}
