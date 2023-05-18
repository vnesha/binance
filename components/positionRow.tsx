import StreamMarketPrice from "../hooks/useStreamMarketPrice";
import {
  formatNumber,
  addTextClass,
  addBgClass,
} from "../util/formatingNumber";
import { useCallback, useState } from "react";

function PositionRow({ position, index, livePrices, account, exchangeInfo }) {
  const [livePrice, setLivePrice] = useState(null);
  const unrealizedProfit = livePrice
    ? (livePrice - position.entryPrice) * position.positionAmt
    : position.unRealizedProfit;
  const margin = Math.abs(position.positionAmt * livePrice) / position.leverage;
  const roe = (unrealizedProfit / margin) * 100;
  const marginRatio = (account?.maintMargin / account?.marginBalance) * 100;
  const symbolData = exchangeInfo?.[position.symbol];
  const quoteAsset = symbolData?.quoteAsset || "";
  const pricePrecision = symbolData?.pricePrecision;
  const baseAsset = symbolData?.baseAsset;
  const contractType = symbolData?.contractType.toLowerCase();
  const contractTypeCapitalized =
    contractType.charAt(0).toUpperCase() + contractType.slice(1);
  const handlePriceUpdate = useCallback(
    (symbol, price) => {
      if (symbol === position.symbol) {
        setLivePrice(price);
      }
    },
    [position.symbol]
  );

  return (
    <div
      key={position.symbol}
      className={`flex flex-row items-center border-b border-gray relative text-xs  ${
        index === 0 ? "border-t" : ""
      }`}
    >
      <div className="flex flex-grow flex-shrink-0 basis-28 w-28 items-center">
        <div
          className={`${addBgClass(position.positionAmt)} w-1 h-10 mr-1`}
        ></div>
        <div>
          <div className="font-bold">{position.symbol}</div>
          <div>{contractTypeCapitalized}</div>
        </div>
        <div className="bg-yellow/10 text-yellow ml-1 pr-1 pl-1 rounded-sm">
          {position.leverage}x
        </div>
      </div>
      <div
        className={`${addTextClass(
          position.positionAmt
        )} flex-grow flex-shrink-0 basis-20 w-20`}
      >
        {position.positionAmt} {baseAsset}
      </div>
      <div className="flex-grow flex-shrink-0 basis-20v w-20">
        {formatNumber(position.entryPrice, quoteAsset, false, pricePrecision, {
          showPlusSign: false,
          customSuffix: "",
        })}
      </div>
      <StreamMarketPrice
        symbol={position.symbol}
        onPriceUpdate={handlePriceUpdate}
        quoteAsset={quoteAsset}
        pricePrecision={pricePrecision}
      />
      <div className="flex-grow flex-shrink-0 basis-20 w-20 text-orange">
        {position.liquidationPrice == 0
          ? "--"
          : formatNumber(
              position.liquidationPrice,
              quoteAsset,
              false,
              pricePrecision,
              { showPlusSign: false, customSuffix: "" }
            )}
      </div>
      <div className="flex-grow flex-shrink-0 basis-20 w-20">
        {livePrice
          ? formatNumber(marginRatio, position.symbol, false, 2, {
              showPlusSign: false,
              customSuffix: "%",
            })
          : "--"}
      </div>
      <div className="flex-grow flex-shrink-0 basis-24 w-24">
        <div>
          {livePrice
            ? formatNumber(margin, quoteAsset, true, 2, {
                showPlusSign: false,
                customSuffix: "",
              })
            : "--"}
        </div>
        <div>
          (
          {position.marginType.charAt(0).toUpperCase() +
            position.marginType.slice(1)}
          )
        </div>
      </div>
      <div className="flex-grow flex-shrink-0 basis-20 w-20">
        <div className={addTextClass(unrealizedProfit)}>
          {livePrice
            ? formatNumber(unrealizedProfit, quoteAsset, true, 2, {
                showPlusSign: true,
                customSuffix: "",
              })
            : "--"}
        </div>
        <div className={addTextClass(roe)}>
          {livePrice
            ? `(${formatNumber(roe, quoteAsset, false, 2, {
                showPlusSign: true,
                customSuffix: "%",
              })})`
            : "--"}
        </div>
      </div>
    </div>
  );
}

export default PositionRow;
