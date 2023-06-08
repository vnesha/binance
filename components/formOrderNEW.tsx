"use client";
import { useFormik } from "formik";
import { usePositionData } from "@/app/hooks/useAllPositionData";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function NewOrderForm() {
  const { perpetualSymbols } = usePositionData();
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>("");

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
    if (perpetualSymbols.length > 0) {
      let initialSymbol =
        localStorage.getItem("selectedSymbol") || perpetualSymbols[0];
      setSelectedSymbol(initialSymbol);
      formik.setFieldValue("symbol", initialSymbol);
    }
  }, [perpetualSymbols]);

  const handleSelect = (symbol: any) => {
    localStorage.setItem("selectedSymbol", symbol);
    setSelectedSymbol(symbol);
    formik.setFieldValue("symbol", symbol);
  };

  return (
    <div className="w-[255px] bg-black px-4">
      <form onSubmit={formik.handleSubmit}>
        <div className="w-1/2 font-bold">
          <Select
            onValueChange={handleSelect}
            value={selectedSymbol || undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="BTCUSDT">{selectedSymbol}</SelectValue>
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
        </div>
        <button className="mt-40" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default NewOrderForm;
