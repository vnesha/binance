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
import { formatLocale } from "@/util/formatingNumber";

function NewOrderForm() {
  const { positions, perpetualSymbols, leverageBrackets } = usePositionData();
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedSymbol") || null;
    }
    return null;
  });
  const [selectedPosition, setSelectedPosition] = useState<number>(20);
  const [selectedLeverage, setSelectedLeverage] = useState<number>();
  const [hasMounted, setHasMounted] = useState(false);
  const [tab, setTab] = useState<string>("Market");
  const [livePrice, setLivePrice] = useState<number | null>(null);
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
    if (perpetualSymbols.length > 0 && selectedSymbol === null) {
      let initialSymbol =
        localStorage.getItem("selectedSymbol") || perpetualSymbols[0];
      setSelectedSymbol(initialSymbol);
      formik.setFieldValue("symbol", initialSymbol);
    }
  }, [perpetualSymbols, selectedSymbol, formik]);

  useEffect(() => {
    if (selectedSymbol && positions && positions.length > 0) {
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

  const allLivePrices = useAllLivePrices(selectedSymbol || "");

  useEffect(() => {
    let isMounted = true;

    if (allLivePrices && selectedSymbol) {
      const newLivePrice = parseFloat(allLivePrices[selectedSymbol]); // preoblikovanje u number
      setLivePrice(newLivePrice); // ažuriranje stanja livePrice
      if (isMounted) {
        console.log(livePrice);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [allLivePrices, selectedSymbol]);

  useEffect(() => {
    setHasMounted(true);
  }, [selectedSymbol, positions, leverageBrackets, perpetualSymbols]);

  if (!hasMounted) {
    return null;
  }

  const livePriceNumber =
    livePrice !== null ? parseFloat(livePrice.toString()) : 0;
  const slNumber = formik.values.sl ? parseFloat(formik.values.sl) : 0;

  const livePriceFormatted = isNaN(livePriceNumber)
    ? ""
    : formatLocale(livePriceNumber);

  return (
    <div className="w-[300px] bg-gray-middle-light px-4">
      <form onSubmit={formik.handleSubmit}>
        <div className="flex items-center justify-between font-bold">
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
        <div className="mt-4 flex h-6 items-center border-b-[1px] border-gray-dark/60 pb-6 pt-1">
          {livePriceFormatted}
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
