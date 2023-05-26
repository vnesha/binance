import { useOpenOrder } from "@/app/hooks/useOpenOrder";

export const OpenOrder = ({
  symbol,
  quantity,
  handleSubmit,
}: {
  symbol: string;
  quantity: number;
  handleSubmit: (symbol: string) => void;
}) => {
  const openMarkOrderMutation = useOpenOrder();

  const handleOpenMarkClick = () => {
    openMarkOrderMutation.mutate({ symbol, quantity });
    handleSubmit(symbol); // Prosleđivanje simbola u handleSubmit funkciju
  };

  return (
    <button
      type="button"
      className="bg-green/50 hover:bg-green/70 text-white font-bold py-2 px-4 rounded"
      onClick={handleOpenMarkClick}
      disabled={openMarkOrderMutation.isLoading}
    >
      Open Position
    </button>
  );
};
