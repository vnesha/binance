"use client";
import RangeSlider from "@/components/sliderLeverage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DialogLeverageProps {
  selectedPosition: number;
  initialMargin: number;
  selectedLeverage: number;
  selectedSymbol: string;
}

export function DialogLeverage({
  selectedPosition,
  selectedLeverage,
  selectedSymbol,
}: DialogLeverageProps) {
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <div className="rounded-sm bg-gray-light-middle px-8 py-[2px] hover:bg-gray-middle">
            {selectedPosition}x
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[384px] md:max-w-[384px] lg:max-w-[384px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-lighter">
              Adjust Leverage
            </DialogTitle>
          </DialogHeader>
          <RangeSlider
            initialMargin={selectedLeverage || 0}
            selectedPosition={selectedPosition || 0}
            selectedSymbol={selectedSymbol || ""}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
