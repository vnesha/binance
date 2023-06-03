import { useOpenOrder } from "@/app/hooks/useOpenOrderNew";
import { VariantProps, cva } from "class-variance-authority";

export const OpenOrder = ({
  isFormValid,
  isSubmitting,
  variant,
  buttonName,
  onButtonClick,
}: {
  isFormValid: boolean;
  isSubmitting: boolean;
  variant: "BUY" | "SELL";
  buttonName: string;
  onButtonClick?: (side: "BUY" | "SELL") => void;
}) => {
  const openMarkOrderMutation = useOpenOrder();

  const buttonVariants = cva(
    "w-full cursor-pointer rounded px-4 py-[10px] font-medium text-sm text-white",
    {
      variants: {
        variant: {
          BUY: "bg-green hover:bg-green/90",
          SELL: "bg-red hover:bg-red/90",
        },
      },
      defaultVariants: {
        variant: "BUY",
      },
    }
  );

  return (
    <button
      type="submit"
      className={buttonVariants({ variant })}
      disabled={!isFormValid || isSubmitting || openMarkOrderMutation.isLoading}
      onClick={() => onButtonClick && onButtonClick(variant)}
    >
      {buttonName}
    </button>
  );
};
