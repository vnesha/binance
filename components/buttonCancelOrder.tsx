import { useCancelOrder } from "@/app/hooks/useCancelOrder";

type CancelButtonProps = {
  symbol: string;
  orderId: number;
};

export default function CancelButton({ symbol, orderId }: CancelButtonProps) {
  const cancelOrder = useCancelOrder();

  const handleCloseClick = () => {
    cancelOrder.mutate({ symbol, orderId });
  };

  return (
    <button onClick={handleCloseClick} disabled={cancelOrder.isLoading}>
      Cancel Order
    </button>
  );
}
