import { formatDateAndTime } from "@/util/formatDateAndTime";
import { OrderDataRowProps } from "@/app/types/types";
import { formatOrderType, formatStopPrice } from "@/util/formatOrderType";
import { formatNumber, addTextClassSide } from "@/util/formatingNumber";
import CancelButton from "./buttonCancelOrder";

export default function OrderDataRow({
  order,
  index,
  exchangeInfo,
}: OrderDataRowProps) {
  const formattedTime = formatDateAndTime(order.time);
  const symbolInfo = exchangeInfo.symbols.find(
    (info: { symbol: string }) => info.symbol === order.symbol
  );

  const lotSizeFilter = symbolInfo.filters.find(
    (filter: { filterType: string }) => filter.filterType === "LOT_SIZE"
  );

  const stepSize = lotSizeFilter.stepSize;
  const baseAssetPrecision = stepSize.indexOf(1) - 1;

  const stopPrice = formatStopPrice(order.type, order.side, order.stopPrice);
  const quantity = formatNumber(
    order.origQty,
    symbolInfo.baseAsset,
    true,
    baseAssetPrecision,
    {
      showPlusSign: false,
      customSuffix: "",
    }
  );

  const price = formatNumber(
    order.price,
    symbolInfo.baseAsset,
    false,
    symbolInfo.pricePrecision,
    {
      showPlusSign: false,
      customSuffix: "",
    }
  );

  // const priceFilter = symbolInfo.filters.find(
  //   (filter: { filterType: string }) => filter.filterType === "PRICE_FILTER"
  // );

  // const tickSize = priceFilter.tickSize;
  // const pricePrecision = tickSize.indexOf(1) - 1;
  // console.log("pricePrecision", pricePrecision);

  return (
    <div
      key={order.symbol}
      className={`relative flex h-10 flex-row items-center border-b border-gray text-xs  ${
        index === 0 ? "border-t" : ""
      }`}
    >
      <div className="flex-shrink-0 flex-grow basis-[115px]">
        {formattedTime}
      </div>
      <div className="flex-shrink-0 flex-grow basis-[85px]">
        <div className="font-medium">{order.symbol}</div>
        <div>Perpetual</div>
      </div>
      <div className="flex-shrink-0 flex-grow basis-[100px]">
        {formatOrderType(order.type)}
      </div>
      <div
        className={`flex-shrink-0 flex-grow basis-[85px] ${addTextClassSide(
          order.side
        )}`}
      >
        {order.side == "SELL" ? "Sell" : "Buy"}
      </div>
      <div className="flex-shrink-0 flex-grow basis-[100px]">
        {order.price == 0 ? "-" : price}
      </div>
      <div className="flex-shrink-0 flex-grow basis-[110px]">
        {order.origQty == 0 ? "Close Position" : quantity}
      </div>
      <div className="flex-shrink-0 flex-grow basis-[120px]">
        {formatNumber(
          order.executedQty,
          symbolInfo.baseAsset,
          true,
          baseAssetPrecision,
          {
            showPlusSign: false,
            customSuffix: "",
          }
        )}
      </div>
      <div className="flex-shrink-0 flex-grow basis-[90px]">
        {order.reduceOnly == 0 ? "No" : "Yes"}
      </div>
      <div className="flex-shrink-0 flex-grow basis-[80px]">
        {order.priceProtect == 0 ? "No" : "Yes"}
      </div>
      <div className="flex-shrink-0 flex-grow basis-[112px]">
        <div>Last Price</div>
        <div>
          {stopPrice.prefix +
            formatNumber(
              stopPrice.value,
              symbolInfo.baseAsset,
              false,
              symbolInfo.pricePrecision,
              {
                showPlusSign: false,
                customSuffix: "",
              }
            )}
        </div>
      </div>
      <CancelButton symbol={order.symbol} orderId={order.orderId} />
    </div>
  );
}
