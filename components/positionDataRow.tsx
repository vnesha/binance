import React, { Fragment } from "react";
import { formatNumber, addTextClass, addBgClass } from "@/util/formatingNumber";
import { CombinedDataType } from "@/app/types/types";

const PositionDataRow = ({
  data,
  index,
  isLoading,
}: {
  data: CombinedDataType;
  index: number;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="animate-spin border-t-4 border-yellow h-16 w-16 rounded-full"></div>
      </div>
    );
  }

  return (
    <div
      key={data.symbol}
      className={`flex flex-row items-center border-b border-gray relative text-xs  ${
        index === 0 ? "border-t" : ""
      }`}
    >
      <div className="flex flex-grow flex-shrink-0 basis-28 w-28 items-center">
        <div className={`${addBgClass(data.positionAmt)} w-1 h-10 mr-1`}></div>
        <div>
          <div className="font-bold">{data.symbol}</div>
          <div>{data.contractTypeCapitalized}</div>
        </div>
        <div className="bg-yellow/10 text-yellow ml-1 pr-1 pl-1 rounded-sm">
          {data.leverage}x
        </div>
      </div>
      <div
        className={`${addTextClass(
          data.positionAmt
        )} flex-grow flex-shrink-0 basis-20 w-20`}
      >
        {data.positionAmt} {data.baseAsset}
      </div>
      <div className="flex-grow flex-shrink-0 basis-20v w-20">
        {formatNumber(
          data.entryPrice,
          data.quoteAsset,
          false,
          data.pricePrecision,
          {
            showPlusSign: false,
            customSuffix: "",
          }
        )}
      </div>
      <div className="flex-grow flex-shrink-0 basis-20 w-20">
        {formatNumber(
          data.livePrice,
          data.quoteAsset,
          false,
          data.pricePrecision,
          {
            showPlusSign: false,
            customSuffix: "",
          }
        )}
      </div>
      <div className="flex-grow flex-shrink-0 basis-20 w-20 text-orange">
        {data.liquidationPrice == 0
          ? "--"
          : formatNumber(
              data.liquidationPrice,
              data.quoteAsset,
              false,
              data.pricePrecision,
              { showPlusSign: false, customSuffix: "" }
            )}
      </div>
      <div className="flex-grow flex-shrink-0 basis-20 w-20">
        {formatNumber(data.marginRatio, data.quoteAsset, true, 2, {
          showPlusSign: false,
          customSuffix: "%",
        })}
      </div>
      <div className="flex-grow flex-shrink-0 basis-24 w-24">
        <div>
          {formatNumber(data.margin, data.quoteAsset, true, 2, {
            showPlusSign: false,
            customSuffix: "",
          })}
        </div>
        <div>
          ({data.marginType.charAt(0).toUpperCase() + data.marginType.slice(1)})
        </div>
      </div>

      <div className="flex-grow flex-shrink-0 basis-20 w-20">
        <div className={addTextClass(data.unrealizedProfit)}>
          {formatNumber(data.unrealizedProfit, data.quoteAsset, true, 2, {
            showPlusSign: true,
            customSuffix: "",
          })}
        </div>
        <div className={addTextClass(data.roe)}>
          {`(${formatNumber(data.roe, data.quoteAsset, false, 2, {
            showPlusSign: true,
            customSuffix: "%",
          })})`}
        </div>
      </div>
    </div>
  );
};

export default PositionDataRow;
