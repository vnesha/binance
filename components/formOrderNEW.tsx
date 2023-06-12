"use client";
import { useFormik } from "formik";
import { useCallback } from "react";
import { usePositionData } from "@/app/hooks/useAllPositionData";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CombinedDataType } from "@/app/types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function NewOrderForm() {
  const { positions, perpetualSymbols } = usePositionData();
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<number>(20);

  const formik = useFormik({
    initialValues: {
      symbol: "",
    },
    onSubmit: async (values) => {
      console.log(values);
      // await openMarkOrderMutation.mutateAsync({
      //   symbol: values.selectedSymbol,
      //   quantity: parseFloat(values.quantity),
      //   side: selectedSide,
      // });
    },
  });

  useEffect(() => {
    if (perpetualSymbols.length > 0 && !selectedSymbol) {
      let initialSymbol =
        localStorage.getItem("selectedSymbol") || perpetualSymbols[0];
      setSelectedSymbol(initialSymbol);
      formik.setFieldValue("symbol", initialSymbol);
    }
  }, [perpetualSymbols, selectedSymbol]);

  useEffect(() => {
    if (selectedSymbol && positions.length > 0) {
      // Filter out the position data for the selected symbol
      const foundPosition = positions.find(
        (position: any) => position.symbol === selectedSymbol
      );
      if (foundPosition) {
        setSelectedPosition(foundPosition.leverage); // Koristimo leverage direktno
      }
    }
  }, [selectedSymbol, positions]);

  const handleSelect = useCallback(
    (symbol: string) => {
      localStorage.setItem("selectedSymbol", symbol);
      setSelectedSymbol(symbol);
      formik.setFieldValue("symbol", symbol);

      // Filter out the position data for the selected symbol
      if (positions) {
        const foundPosition = positions.find(
          (position: any) => position.symbol === symbol
        );
        if (foundPosition) {
          console.log("Leverage:", foundPosition.leverage);
          setSelectedPosition(foundPosition.leverage); // Koristimo leverage direktno
        }
      }
    },
    [positions]
  );

  return (
    <div className="w-[255px] bg-black px-4">
      <form onSubmit={formik.handleSubmit}>
        <div className="w-1/2 font-bold">
          <Select
            onValueChange={handleSelect}
            value={selectedSymbol || undefined}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  localStorage.getItem("selectedSymbol") || "BTCUSDT"
                }
              >
                {selectedSymbol}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-[200px]">
                {perpetualSymbols.map((symbol: string, index: number) => (
                  <SelectItem value={symbol} key={`${symbol}-${index}`}>
                    {symbol}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
            <div className="m-0 p-0 text-xs">Perpetual</div>
          </Select>
          <div>Leverage: {selectedPosition}</div>
        </div>
        <button className="mt-40" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default NewOrderForm;
