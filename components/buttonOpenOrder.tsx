import { useOpenOrder } from "@/hooks/useOpenPosition";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const Button = ({
  isFormValid = true,
  isSubmitting = false,
  variant = "BUY",
  buttonName = "",
  onButtonClick,
  className,
  ...props
}: Partial<{
  isFormValid: boolean;
  isSubmitting: boolean;
  variant: "BUY" | "SELL";
  buttonName: string;
  onButtonClick?: (side: "BUY" | "SELL") => void;
  className?: string;
  [x: string]: any;
}>) => {
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
      className={cn(buttonVariants({ variant }), className)} // koristite cn za spajanje klasa
      disabled={!isFormValid || isSubmitting || openMarkOrderMutation.isLoading}
      onClick={() => onButtonClick && onButtonClick(variant)}
      {...props}
    >
      {buttonName}
    </button>
  );
};
