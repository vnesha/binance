"use client";
import { usePositionData } from "../hooks/usePositionData";
import { CombinedDataType } from "../types/types";
import { formatNumber } from "@/util/formatingNumber";

function Test() {
  const { combinedData } = usePositionData();

  return (
    <div>
      {combinedData?.map((data: CombinedDataType) => {
        const precision = data.exchangeInfoData?.pricePrecision;
        const quoteAsset = data.exchangeInfoData?.quoteAsset;
        const baseAsset = data.exchangeInfoData?.baseAsset;

        return (
          <div key={data.symbol}>
            <h3>{data.symbol}</h3>
            <p>
              {formatNumber(data.initialMargin, quoteAsset, false, 2, {
                showPlusSign: false,
                customSuffix: "",
              })}
            </p>
            <p>{data.positionAmt + " " + baseAsset}</p>
            <p>
              {formatNumber(data.livePrice, quoteAsset, false, precision, {
                showPlusSign: false,
                customSuffix: "",
              })}
            </p>
            <p>
              {formatNumber(data.unrealizedProfit, quoteAsset, true, 2, {
                showPlusSign: true,
                customSuffix: "",
              })}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default Test;
