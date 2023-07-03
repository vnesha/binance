"use client";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { usePositionData } from "@/hooks/useAllPositionData";
import { DialogLeverage } from "./dialogLeverage";
import { SelectSymbol } from "./selectSymbol";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DisplayStreamPrice } from "./displayStreamPrice";
import { selectSymbol } from "@/util/selectSymbol";
import { setLivePrice } from "@/util//setLivePrice";
import { useOpenOrder } from "@/hooks/useOpenPosition";
import { funCalcCharacter } from "@/util/funCalcCharacter";
import useAllLivePrices from "@/hooks/useAllLivePrice";
import AccountInfo from "@/components/infoAccount";
import TextInputField from "./textInputField";
import TradingInfo from "./infoTrading";
import { calcCostMarkPosition } from "@/util/calcCostMarkPosition";
import Cookies from "js-cookie";

export default function FormOrderSl() {
  const {
    positions,
    accountInfo,
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
    const storedSymbol = Cookies.get("selectedSymbol");
    return storedSymbol || null;
  });
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [quantity, setQuantity] = useState<number>(0.0);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [riskDollars, setriskDollars] = useState<number>(0);
  const [tp, setTp] = useState<number>(0);
  const [size, setSize] = useState<number>(0.0);
  const [loss, setLoss] = useState<string>("0.00");
  const livePrices = useAllLivePrices(selectedSymbol || "BTCUSDT");
  const livePriceData = livePrices[selectedSymbol || "BTCUSDT"];
  const bestBid = livePriceData ? livePriceData.bestBid : "Undefined";
  const bestAsk = livePriceData ? livePriceData.bestAsk : "Undefined";
  const markPrice = livePriceData ? livePriceData.markPrice : "Undefined";

  useEffect(() => {
    if (selectedSymbol !== null) {
      Cookies.set("selectedSymbol", selectedSymbol);
    }
  }, [selectedSymbol]);

  const formik = useFormik({
    initialValues: {
      symbol: selectedSymbol,
      quantity: quantity,
      side: side,
      type: tab,
      riskPrecent: 1,
      sl: "",
      rr: 3,
      tp: tp,
      loss: loss,
    },
    onSubmit: async (values) => {
      // console.log(values);
      await openOrderMutation.mutateAsync({
        symbol: selectedSymbol,
        quantity: values.quantity,
        side: side,
        stopLossPrice: parseFloat(values.sl),
        takeProfitPrice: parseFloat(values.tp.toFixed(quotePrecision)),
      });
      formik.setFieldValue("sl", "");
    },
  });

  const riskPrecent = formik.values.riskPrecent;
  const rr = formik.values.rr;

  useEffect(() => {
    const balance = accountInfo?.totalWalletBalance ?? 0;
    setWalletBalance(balance);
  }, [accountInfo]);

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
    quotePrecision,
    baseAsset,
    quoteAsset,
  } = setLivePrice(exchangeInfo, selectedSymbol);

  const sl = parseFloat(formik.values.sl);
  const streamPrice = parseFloat(livePrice.toString());

  const { longCost, shortCost } = calcCostMarkPosition({
    numberOfContracts: formik.values.quantity,
    leverage: selectedPosition,
    markPrice: parseFloat(markPrice),
    bidPrice: [parseFloat(bestBid)],
    askPrice: [parseFloat(bestAsk)],
  });

  useEffect(() => {
    if (formik.values.sl === "") {
      setLoss(""); // Postavljanje vrednosti na prazan string
      formik.setFieldValue("loss", "");
    } else if (!isNaN(sl) && !isNaN(streamPrice)) {
      const lossValue = Math.abs(((sl - streamPrice) / streamPrice) * 100);
      setLoss(lossValue.toFixed(2));
      formik.setFieldValue("loss", lossValue.toFixed(2));
    }
  }, [formik.values.sl, livePrice]);

  useEffect(() => {
    if (sl < streamPrice) {
      setSide("BUY");
      formik.setFieldValue("side", "BUY");
      // console.log(side);
      const tp = streamPrice + Math.abs(streamPrice - sl) * rr;
      setTp(tp);
      formik.setFieldValue("tp", tp);
    } else if (sl > streamPrice) {
      setSide("SELL");
      formik.setFieldValue("side", "SELL");
      // console.log(side);
      const tp = streamPrice - Math.abs(streamPrice - sl) * rr;
      setTp(tp);
      formik.setFieldValue("tp", tp);
    }
  }, [streamPrice, tp, sl, rr]);

  useEffect(() => {
    if (formik.values.sl !== "") {
      const riskDollars = (riskPrecent * walletBalance) / 100;
      const quantity = riskDollars / Math.abs(streamPrice - sl);
      const size = quantity * streamPrice;
      setriskDollars(riskDollars);
      setSize(size);
      // proveravamo da li je quantity NaN
      if (isNaN(quantity)) {
        formik.setFieldValue("quantity", "0.00");
      } else {
        formik.setFieldValue("quantity", quantity.toFixed(baseAssetPrecision));
      }
    } else {
      setriskDollars(0);
      setSize(0);
      formik.setFieldValue("quantity", "0.00");
    }
  }, [riskPrecent, walletBalance, streamPrice, sl, size]);

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
                className="w-[67%]"
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
                className="w-[30%]"
                prefix="1:"
                componentName="rr"
                name="rr"
                value={formik.values.rr}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value.length <= 2) {
                    formik.setFieldValue("rr", value);
                  }
                }}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="flex flex-row justify-between">
              <TextInputField
                type="number"
                label="Stop Loss"
                // sufix="USDT"
                className="w-[67%]"
                name="sl"
                value={formik.values.sl}
                onChange={(event) => {
                  funCalcCharacter(event, livePrice, formik);
                }}
                onBlur={formik.handleBlur}
              />
              <TextInputField
                type="number"
                sufix="%"
                className="w-[30%]"
                name="loss"
                value={formik.values.loss}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <TradingInfo
              className="mt-4 text-xs"
              quantity={formik.values.quantity}
              riskDollars={riskDollars}
              quoteAsset={quoteAsset}
              baseAssetPrecision={baseAssetPrecision}
              quotePrecision={quotePrecision}
              baseAsset={baseAsset}
              tp={formik.values.tp}
              sl={formik.values.sl}
              size={size}
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
