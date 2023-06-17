import { useChangeLeverage } from "@/app/hooks/useChangeLeverage";
import { DialogTrigger } from "@/components/ui/dialog";

type ButtonProps = {
  symbol: string;
  leverage: number;
};

export default function ChangeLeverageButton({
  symbol,
  leverage,
}: ButtonProps) {
  const changeLeverage = useChangeLeverage();

  const handleClick = () => {
    changeLeverage.mutate({
      symbol: symbol,
      leverage: leverage,
    });
  };

  return (
    <DialogTrigger className="w-full">
      <div
        className="cursor-pointer rounded bg-yellow px-4 py-[10px] text-sm font-medium text-[#181a20] hover:bg-yellow/90"
        onClick={handleClick}
      >
        Confirm
      </div>
    </DialogTrigger>
  );
}
