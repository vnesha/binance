"use client";
import { useState } from "react";
import useAllLivePrices from "@/app/hooks/useAllLivePrice";
import { setFormatedPrice } from "../util/setFormatedPrice";

export function setLivePrice(exchangeInfo: any, selectedSymbol: string | null) {
  const symbolInfo = exchangeInfo?.symbols.find(
    (info: { symbol: string }) => info.symbol === selectedSymbol
  );
  const lotSizeFilter = symbolInfo?.filters.find(
    (filter: { filterType: string }) => filter.filterType === "LOT_SIZE"
  );
  const stepSize = lotSizeFilter?.stepSize;
  const baseAssetPrecision = stepSize?.indexOf(1) - 1;
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
  return {
    isPriceUp,
    isPriceDown,
    isPriceEqually,
    isChanged,
    isPriceValid,
    livePriceFormatted,
  };
}
