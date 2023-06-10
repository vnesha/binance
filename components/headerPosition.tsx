export function PositionHeader({ dataIsEmpty }: { dataIsEmpty: boolean }) {
  return (
    <div
      className={`flex h-8 flex-row items-center border-gray text-xs text-gray-light ${
        dataIsEmpty ? "border-b" : ""
      }`}
    >
      <div className="flex-shrink-0 flex-grow basis-28">Symbol</div>
      <div className="flex-shrink-0 flex-grow basis-20">Size</div>
      <div className="flex-shrink-0 flex-grow basis-20">Entry Price</div>
      <div className="flex-shrink-0 flex-grow basis-20">Mark Price</div>
      <div className="flex-shrink-0 flex-grow basis-20">Liq.Price</div>
      <div className="flex-shrink-0 flex-grow basis-20">Margin Ratio</div>
      <div className="flex-shrink-0 flex-grow basis-24">Margin</div>
      <div className="flex-shrink-0 flex-grow basis-20">PNL (ROE %)</div>
      <div className="flex-shrink-0 flex-grow basis-[25px] text-yellow">
        Close All Positions
      </div>
    </div>
  );
}
