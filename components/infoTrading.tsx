import { formatLocaleSufix } from "@/util/formatingNumber";

export default function TradingInfo({
  className,
  quantity,
  riskDollars,
  quoteAsset,
  baseAssetPrecision,
}: {
  className?: string;
  quantity: number;
  riskDollars: number;
  quoteAsset: string;
  baseAssetPrecision: number;
}) {
  const rawQuantity = isNaN(quantity) ? 0 : +quantity;
  const displayQuantity = rawQuantity.toFixed(baseAssetPrecision);

  return (
    <div className={className}>
      <div>Quantity: {displayQuantity}</div>
      <div>Risk: {formatLocaleSufix(riskDollars, quoteAsset)}</div>
    </div>
  );
}
