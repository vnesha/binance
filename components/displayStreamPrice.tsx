export function DisplayStreamPrice(props: any) {
  return (
    <div
      className={`mt-4 flex h-6 items-center border-b-[1px] border-gray-dark/60 pb-6 pt-1 ${
        props.isPriceValid
          ? props.isPriceUp
            ? "text-green"
            : props.isPriceDown
            ? "text-red"
            : "text-gray-lighter"
          : "text-gray-lighter"
      }`}
    >
      {props.isPriceValid ? (
        <>
          {props.livePriceFormatted}
          {props.isChanged && !props.isPriceEqually && (
            <span
              className={`${props.isPriceUp ? "text-green" : "text-red"}  py-2`}
            >
              {props.isPriceUp ? "↑" : "↓"}
            </span>
          )}
        </>
      ) : (
        `${props.livePriceFormatted}`
      )}
    </div>
  );
}
