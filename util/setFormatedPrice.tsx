"use client";
import { useEffect, useState } from "react";

export function setFormatedPrice(
  streamPrice: number,
  symbolInfo: any,
  livePrice: number | null,
  allLivePrices: {
    [symbol: string]: { price: string; direction: "up" | "down" | "equally" };
  },
  selectedSymbol: string | null,
  setLivePrice: any
) {
  const [priceFormatted, setPriceFormatted] = useState(false);
  const livePriceFormatted = formatedPrice(
    priceFormatted,
    streamPrice,
    symbolInfo,
    livePrice,
    allLivePrices,
    selectedSymbol,
    setPriceFormatted,
    setLivePrice
  );
  return livePriceFormatted;
}
function formatedPrice(
  priceFormatted: boolean,
  streamPrice: number,
  symbolInfo: any,
  livePrice: number | null,
  allLivePrices: {
    [symbol: string]: { price: string; direction: "up" | "down" | "equally" };
  },
  selectedSymbol: string | null,
  setPriceFormatted: any,
  setLivePrice: any
) {
  const livePriceFormatted =
    priceFormatted && streamPrice && !isNaN(streamPrice)
      ? streamPrice.toLocaleString("en-US", {
          minimumFractionDigits: symbolInfo?.pricePrecision,
          maximumFractionDigits: symbolInfo?.pricePrecision,
        })
      : livePrice !== null && !isNaN(livePrice)
      ? streamPrice.toLocaleString("en-US", {
          minimumFractionDigits: symbolInfo?.pricePrecision,
          maximumFractionDigits: symbolInfo?.pricePrecision,
        })
      : "";

  useEffect(() => {
    let isMounted = true;

    if (allLivePrices && selectedSymbol) {
      const newLivePrice = parseFloat(allLivePrices[selectedSymbol]?.price);
      if (isMounted) {
        if (newLivePrice === streamPrice) {
          setPriceFormatted(true);
        }
        setLivePrice(newLivePrice);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [allLivePrices, selectedSymbol]);
  return livePriceFormatted;
}
