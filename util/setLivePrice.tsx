"use client";
import { useState } from "react";
import useAllLivePrices from "@/app/hooks/useAllLivePrice";
import { setFormatedPrice } from "../util/setFormatedPrice";

export function setLivePrice(exchangeInfo: any, selectedSymbol: string | null) {
  const symbolInfo = exchangeInfo?.symbols.find(
    (info: { symbol: string }) => info.symbol === selectedSymbol
  );
  const lotSizeFilter = symbolInfo?.filters.find(
    (filter: { filterType: string }) => filter.filterType === "MARKET_LOT_SIZE"
  );
  const priceFilter = symbolInfo?.filters.find(
    (filter: { filterType: string }) => filter.filterType === "PRICE_FILTER"
  );
  const stepSize = lotSizeFilter?.stepSize;
  const tickSize = priceFilter?.tickSize;
  const baseAssetPrecision =
    stepSize && stepSize.includes(".") ? stepSize.split(".")[1].length : 0;
  const quotePrecision = tickSize
    ? tickSize.toString().split(".")[1]?.length || 0
    : 0;
  const baseAsset = symbolInfo?.baseAsset;
  const quoteAsset = symbolInfo?.quoteAsset;
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const allLivePrices = useAllLivePrices(selectedSymbol || "");
  const priceDirection = selectedSymbol
    ? allLivePrices[selectedSymbol.toUpperCase()]?.direction
    : undefined;
  const isPriceUp = priceDirection === "up";
  const isPriceDown = priceDirection === "down";
  const isPriceEqually = priceDirection === "equally";
  const isChanged = priceDirection !== undefined;
  const isPriceValid = livePrice !== null && !isNaN(livePrice);
  const streamPrice = livePrice !== null ? parseFloat(livePrice.toString()) : 0;
  const livePriceFormatted = setFormatedPrice(
    streamPrice,
    symbolInfo,
    livePrice,
    allLivePrices,
    selectedSymbol,
    setLivePrice
  );

  // console.log("lotSizeFilter", lotSizeFilter);
  // console.log("priceFilter", priceFilter);
  // console.log("stepSize", stepSize);
  // console.log("tickSize", tickSize);
  // console.log("baseAssetPrecision", baseAssetPrecision);
  // console.log("quotePrecision", quotePrecision);

  return {
    isPriceUp,
    isPriceDown,
    isPriceEqually,
    isChanged,
    isPriceValid,
    livePriceFormatted,
    livePrice: streamPrice,
    baseAssetPrecision,
    quotePrecision,
    baseAsset,
    quoteAsset,
  };
}
