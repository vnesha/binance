import { formatLocaleSufix } from "@/util/formatingNumber";

export default function TradingInfo({
  className,
  quantity,
  riskDollars,
  quoteAsset,
  baseAssetPrecision,
  quotePrecision,
  baseAsset,
  tp,
  size,
  sl,
}: {
  className?: string;
  quantity: number;
  riskDollars: number;
  quoteAsset: string;
  baseAssetPrecision: number;
  quotePrecision: number;
  baseAsset: string;
  tp: number;
  sl: string;

  size?: number;
}) {
  const rawSize = size === undefined || isNaN(size) ? 0 : +size;
  const rawQuantity = +quantity;
  const displayQuantity = rawQuantity
    ? rawQuantity.toFixed(baseAssetPrecision)
    : "0.00";
  const tpFormatted =
    sl === ""
      ? "0.00"
      : tp.toLocaleString("en-US", {
          minimumFractionDigits: quotePrecision,
          maximumFractionDigits: quotePrecision,
        });

  return (
    <div className={className}>
      <div className="pb-[2px]">
        Quantity {displayQuantity} {baseAsset}
      </div>
      <div className="pb-[2px]">
        Size {formatLocaleSufix(rawSize, quoteAsset)}
      </div>
      <div className="pb-[2px]">Take Profit {tpFormatted}</div>
      <div className="pb-[2px]">
        Risk {formatLocaleSufix(riskDollars, quoteAsset)}
      </div>
      <div>Reward</div>
    </div>
  );
}
