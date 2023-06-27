"use client";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { usePositionData } from "@/app/hooks/useAllPositionData";
import { DialogLeverage } from "./dialogLeverage";
import { SelectSymbol } from "./selectSymbol";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountInfo from "@/components/infoAccount";
import TextInputField from "./textInputField";
import { DisplayStreamPrice } from "./displayStreamPrice";
import { selectSymbol } from "@/util/selectSymbol";
import { setLivePrice } from "@/util//setLivePrice";
import TradingInfo from "./infoTrading";
import { useOpenOrder } from "@/app/hooks/useOpenPosition";
import { funCalcCharacter } from "@/util/funCalcCharacter";

export default function FormOrderSl() {
  const {
    combinedData,
    positions,
    perpetualSymbols,
    leverageBrackets,
    exchangeInfo,
  } = usePositionData();
  const openOrderMutation = useOpenOrder();
  const [tab, setTab] = useState<string>("Market");
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
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [quantity, setQuantity] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [riskDollars, setriskDollars] = useState<number>(0);
  const [quoteAsset, setQuoteAsset] = useState<string>("");

  const formik = useFormik({
    initialValues: {
      symbol: selectedSymbol,
      quantity: quantity,
      side: side,
      type: tab,
      sl: "",
      riskPrecent: 1,
    },
    onSubmit: async (values) => {
      console.log(values);
      await openOrderMutation.mutateAsync({
        symbol: selectedSymbol,
        quantity: values.quantity,
        side: side,
      });
    },
  });

  const riskPrecent = formik.values.riskPrecent;

  useEffect(() => {
    if (combinedData.length > 0) {
      const balance = combinedData[0].walletBalance;
      const quoteAsset = combinedData[0].quoteAsset;
      setWalletBalance(balance);
      setQuoteAsset(quoteAsset);
    }
  }, [combinedData]);

  const handleTabChange = (value: string) => {
    setTab(value);
    formik.setFieldValue("type", value);
    formik.setFieldValue("sl", "");
  };

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
    livePrice,
    baseAssetPrecision,
  } = setLivePrice(exchangeInfo, selectedSymbol);

  const sl = parseFloat(formik.values.sl);
  const streamPrice = parseFloat(livePrice.toString());

  useEffect(() => {
    if (sl < streamPrice) {
      setSide("BUY");
      formik.setFieldValue("side", "BUY");
    } else if (sl > streamPrice) {
      setSide("SELL");
      formik.setFieldValue("side", "SELL");
    }
  }, [streamPrice, sl]);

  useEffect(() => {
    const riskDollars = (riskPrecent * walletBalance) / 100;
    const quantity = riskDollars / Math.abs(streamPrice - sl);
    setriskDollars(riskDollars);
    formik.setFieldValue("quantity", quantity.toFixed(baseAssetPrecision));
  }, [riskPrecent, walletBalance, streamPrice, sl]);

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
                name="riskPrecent"
                value={formik.values.riskPrecent}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value.length <= 4) {
                    formik.setFieldValue("riskPrecent", value);
                  }
                }}
                onBlur={formik.handleBlur}
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
              onChange={(event) => {
                funCalcCharacter(event, livePrice, formik);
              }}
              onBlur={formik.handleBlur}
            />
            <TradingInfo
              className="text-xs"
              quantity={formik.values.quantity}
              riskDollars={riskDollars}
              quoteAsset={quoteAsset}
              baseAssetPrecision={baseAssetPrecision}
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
