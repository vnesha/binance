export function PositionHeader() {
  return (
    <div className="flex flex-row text-gray-light text-xs h-8 items-center">
      <div className="flex-grow flex-shrink-0 basis-28">Symbol</div>
      <div className="flex-grow flex-shrink-0 basis-20">Size</div>
      <div className="flex-grow flex-shrink-0 basis-20">Entry Price</div>
      <div className="flex-grow flex-shrink-0 basis-20">Mark Price</div>
      <div className="flex-grow flex-shrink-0 basis-20">Liq.Price</div>
      <div className="flex-grow flex-shrink-0 basis-20">Margin Ratio</div>
      <div className="flex-grow flex-shrink-0 basis-24">Margin</div>
      <div className="flex-grow flex-shrink-0 basis-20">PNL (ROE %)</div>
    </div>
  );
}
