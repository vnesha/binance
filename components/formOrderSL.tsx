"use client";
import { useFormik } from "formik";
import { useCallback } from "react";
import { usePositionData } from "@/app/hooks/useAllPositionData";
import { useEffect, useState } from "react";
import { DialogLeverage } from "./dialogLeverage";
import { SelectSymbol } from "./selectSymbol";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountInfo from "@/components/accountInfo";
import TextInputField from "./textInputField";
import useAllLivePrices from "@/app/hooks/useAllLivePrice";

function NewOrderForm() {
  const { positions, perpetualSymbols, leverageBrackets } = usePositionData();
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<number>(20);
  const [selectedLeverage, setSelectedLeverage] = useState<number>();
  const [hasMounted, setHasMounted] = useState(false);
  const [tab, setTab] = useState<string>("Market");
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
      sl: "",
      type: tab,
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

  const handleTabChange = (value: string) => {
    setTab(value);
    formik.setFieldValue("type", value);
  };

  useEffect(() => {
    if (perpetualSymbols.length > 0 && !selectedSymbol) {
      let initialSymbol =
        localStorage.getItem("selectedSymbol") || perpetualSymbols[0];
      setSelectedSymbol(initialSymbol);
      formik.setFieldValue("symbol", initialSymbol);
    }
  }, [perpetualSymbols, selectedSymbol, formik]);

  useEffect(() => {
    if (selectedSymbol && positions.length > 0) {
      const foundPosition = positions.find(
        (position: any) => position.symbol === selectedSymbol
      );
      if (foundPosition) {
        setSelectedPosition(foundPosition.leverage);
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

      if (positions && leverageBrackets) {
        const foundPosition = positions.find(
          (position: any) => position.symbol === symbol
        );
        const leverageBracket = leverageBrackets.find(
          (bracket: any) => bracket.symbol === symbol
        );
        if (foundPosition) {
          setSelectedPosition(foundPosition.leverage);
        }
        if (leverageBracket) {
          setSelectedLeverage(leverageBracket.brackets[0].initialLeverage);
        }
      }
    },
    [positions, leverageBrackets, formik]
  );

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const allLivePrices = useAllLivePrices(selectedSymbol || "");

  useEffect(() => {
    if (allLivePrices && selectedSymbol) {
      const livePrice = allLivePrices[selectedSymbol];
      console.log(livePrice);
    }
  }, [allLivePrices, selectedSymbol]);

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="w-[300px] bg-gray-middle-light px-4">
      <form onSubmit={formik.handleSubmit}>
        <div className="flex items-center justify-between border-b-[1px] border-gray-dark/60 pb-4 font-bold">
          <div className="flex flex-col items-start">
            <SelectSymbol
              selectedSymbol={selectedSymbol || ""}
              handleSelect={handleSelect}
              placeholder={placeholder || ""}
            />
          </div>
          <div className="mt-4 space-y-1  text-center text-xs font-bold">
            <div className="rounded-sm bg-gray-light-middle py-[2px]">
              Cross
            </div>
            <DialogLeverage
              selectedPosition={selectedPosition || 0}
              initialMargin={selectedLeverage || 0}
              selectedLeverage={selectedLeverage || 0}
              selectedSymbol={selectedSymbol || ""}
            />
          </div>
        </div>
        <Tabs defaultValue="Market">
          <TabsList className="pr-[100px]">
            <TabsTrigger value="Limit" onClick={() => handleTabChange("Limit")}>
              Limit
            </TabsTrigger>
            <TabsTrigger
              value="Market"
              onClick={() => handleTabChange("Market")}
            >
              Market
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Limit"></TabsContent>
          <TabsContent value="Market">
            <div className="flex flex-row justify-between">
              <TextInputField
                type="number"
                label="Risk On Trade"
                sufix="%"
                className="w-[60%]"
                defaultValue={1}
                maxCharacters={3}
              />
              <TextInputField
                type="number"
                label="R/R"
                className="w-[35%]"
                defaultValue={3}
                prefix="1:"
                componentName="TextInputField2"
                maxCharacters={2}
              />
            </div>
            <TextInputField
              type="number"
              label="Stop Loss"
              sufix="USDT"
              className="w-full"
              name="sl"
              value={formik.values.sl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </TabsContent>
        </Tabs>
        <AccountInfo className="mt-4 flex select-none flex-col border-y-[1px] border-gray-dark/60 py-4 text-xs" />
        <button className="mt-10" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default NewOrderForm;
