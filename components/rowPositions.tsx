import { formatNumber, addTextClass, addBgClass } from "@/util/formatingNumber";
import { CombinedDataType } from "@/app/types/types";
import ButtonClosePosition from "./buttonClosePosition";

const PositionDataRow = ({
  data,
  index,
}: {
  data: CombinedDataType;
  index: number;
}) => (
  <div
    key={data.symbol}
    className={`relative flex flex-row items-center border-b border-gray text-xs  ${
      index === 0 ? "border-t" : ""
    }`}
  >
    <div className="flex w-28 flex-shrink-0 flex-grow basis-28 items-center">
      <div className={`${addBgClass(data.positionAmt)} mr-1 h-10 w-1`}></div>
      <div>
        <div className="font-bold">{data.symbol}</div>
        <div>{data.contractTypeCapitalized}</div>
      </div>
      <div className="ml-1 rounded-sm bg-yellow/10 pl-1 pr-1 text-yellow">
        {data.leverage}x
      </div>
    </div>
    <div
      className={`${addTextClass(
        data.positionAmt
      )} w-20 flex-shrink-0 flex-grow basis-20`}
    >
      {data.positionAmt} {data.baseAsset}
    </div>
    <div className="basis-20v w-20 flex-shrink-0 flex-grow">
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
    <div className="w-20 flex-shrink-0 flex-grow basis-20">
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
    <div className="w-20 flex-shrink-0 flex-grow basis-20 text-orange">
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
    <div className="w-20 flex-shrink-0 flex-grow basis-20">
      {formatNumber(data.marginRatio, data.quoteAsset, true, 2, {
        showPlusSign: false,
        customSuffix: "%",
      })}
    </div>
    <div className="w-24 flex-shrink-0 flex-grow basis-24">
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

    <div className="w-20 flex-shrink-0 flex-grow basis-20">
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
    <div className="flex-shrink-0 flex-grow basis-[25px] text-yellow">
      <ButtonClosePosition symbol={data.symbol} quantity={data.positionAmt} />
    </div>
  </div>
);

export default PositionDataRow;
