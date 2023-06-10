export function OpenOrdersHeaader({ dataIsEmpty }: { dataIsEmpty: boolean }) {
  return (
    <div
      className={`flex h-8 flex-row items-center border-gray text-xs text-gray-light ${
        dataIsEmpty ? "border-b" : ""
      }`}
    >
      <div className="flex-shrink-0 flex-grow basis-[115px]">Time</div>
      <div className="flex-shrink-0 flex-grow basis-[85px]">Symbol</div>
      <div className="flex-shrink-0 flex-grow basis-[100px]">Type</div>
      <div className="flex-shrink-0 flex-grow basis-[85px]">Side</div>
      <div className="flex-shrink-0 flex-grow basis-[100px]">Price</div>
      <div className="flex-shrink-0 flex-grow basis-[110px]">Amount</div>
      <div className="flex-shrink-0 flex-grow basis-[120px]">Filled</div>
      <div className="flex-shrink-0 flex-grow basis-[90px]">Reduce Only</div>
      <div className="flex-shrink-0 flex-grow basis-[80px]">Post Only</div>
      <div className="flex-shrink-0 flex-grow basis-[112px]">
        Trigger Conditions
      </div>
      <div className="flex-shrink-0 flex-grow basis-[70px] text-yellow">
        Cancel All
      </div>
    </div>
  );
}
