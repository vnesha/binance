"use client";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { usePositionData } from "@/app/hooks/useAllPositionData";
import { DialogLeverage } from "./dialogLeverage";
import { SelectSymbol } from "./selectSymbol";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountInfo from "@/components/accountInfo";
import TextInputField from "./textInputField";
import { DisplayStreamPrice } from "./displayStreamPrice";
import { selectSymbol } from "@/util/selectSymbol";
import { setLivePrice } from "@/util//setLivePrice";

export default function FormOrderSl() {
  const { positions, perpetualSymbols, leverageBrackets, exchangeInfo } =
    usePositionData();
  const [tab, setTab] = useState<string>("Market");

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

  const [selectedPosition, setSelectedPosition] = useState<number>(20);
  const [selectedLeverage, setSelectedLeverage] = useState<number>();
  const [placeholder] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedSymbol") || "BTCUSDT";
    } else {
      return null;
    }
  });
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedSymbol") || null;
    }
    return null;
  });

  const handleSelect = selectSymbol(
    perpetualSymbols,
    selectedSymbol,
    setSelectedSymbol,
    formik,
    positions,
    setSelectedPosition,
    leverageBrackets,
    setSelectedLeverage
  );

  const {
    isPriceUp,
    isPriceDown,
    isPriceEqually,
    isChanged,
    isPriceValid,
    livePriceFormatted,
  } = setLivePrice(exchangeInfo, selectedSymbol);

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, [selectedSymbol, positions, leverageBrackets, perpetualSymbols]);

  if (!hasMounted) {
    return null;
  }

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
        <DisplayStreamPrice
          isPriceUp={isPriceUp}
          isPriceDown={isPriceDown}
          isPriceEqually={isPriceEqually}
          isChanged={isChanged}
          isPriceValid={isPriceValid}
          livePriceFormatted={livePriceFormatted}
        ></DisplayStreamPrice>

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
