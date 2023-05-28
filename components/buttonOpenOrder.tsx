import { useOpenOrder } from "@/app/hooks/useOpenOrder";

export const OpenOrder = ({
  isFormValid,
  isSubmitting,
}: {
  isFormValid: boolean;
  isSubmitting: boolean;
}) => {
  const openMarkOrderMutation = useOpenOrder();

  return (
    <button
      type="submit"
      className="block bg-green hover:bg-green/90 text-white font-medium py-[10px] px-4 rounded cursor-pointer"
      disabled={!isFormValid || isSubmitting || openMarkOrderMutation.isLoading}
    >
      Buy/Long
    </button>
  );
};
