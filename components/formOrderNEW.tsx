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
  const { positions, perpetualSymbols, leverageBrackets } = usePositionData();
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<number>(20);
  const [selectedLeverage, setSelectedLeverage] = useState<number>();
  const [hasMounted, setHasMounted] = useState(false);
  const [placeholder] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedSymbol") || "BTCUSDT";
    } else {
      return null;
    }
  });

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
    setHasMounted(true);
  }, []);

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
        if (leverageBrackets) {
          const leverageBracket = leverageBrackets.find(
            (bracket: any) => bracket.symbol === selectedSymbol
          );
          if (leverageBracket) {
            setSelectedLeverage(leverageBracket.brackets[0].initialLeverage);
          }
        }
      }
    }
  }, [selectedSymbol, positions, leverageBrackets]);

  const handleSelect = useCallback(
    (symbol: string) => {
      localStorage.setItem("selectedSymbol", symbol);
      setSelectedSymbol(symbol);
      formik.setFieldValue("symbol", symbol);

      // Filter out the position data for the selected symbol
      if (positions && leverageBrackets) {
        const foundPosition = positions.find(
          (position: any) => position.symbol === symbol
        );
        const leverageBracket = leverageBrackets.find(
          (bracket: any) => bracket.symbol === symbol
        );
        if (foundPosition) {
          console.log("Leverage:", foundPosition.leverage);
          setSelectedPosition(foundPosition.leverage); // Koristimo leverage direktno
        }
        if (leverageBracket) {
          console.log(
            "Initial Leverage:",
            leverageBracket.brackets[0].initialLeverage
          );
          setSelectedLeverage(leverageBracket.brackets[0].initialLeverage);
        }
      }
    },
    [positions, leverageBrackets]
  );

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="w-[255px] bg-gray-middle-light px-4">
      <form onSubmit={formik.handleSubmit}>
        <div className="flex items-center justify-between font-bold">
          <div className="flex flex-col items-start">
            <Select
              onValueChange={handleSelect}
              value={selectedSymbol || undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder}>
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
              <div className="m-0 p-0 text-sm font-medium">Perpetual</div>
            </Select>
          </div>
          <div className="mt-3 flex w-1/3 flex-col space-y-1 text-center text-xs font-bold">
            <div className="bg-gray-middle px-6 py-[2px]">Cross</div>
            <div className="bg-gray-middle px-6 py-[2px]">
              {selectedPosition}x
            </div>
            {/* <div>{selectedLeverage}</div> */}
          </div>
        </div>

        <button className="mt-40" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default NewOrderForm;
