import { useState, useEffect } from "react";

type Props = {
  initialMargin: number;
  selectedPosition: number;
};

const RangeSlider: React.FC<Props> = ({ initialMargin, selectedPosition }) => {
  const [value, setValue] = useState<number>(selectedPosition);

  // Listen for changes on selectedPosition and update value
  useEffect(() => {
    setValue(selectedPosition);
  }, [selectedPosition]);

  // Calculating the step size for markers
  const stepSize = initialMargin / 5;

  // Snap to nearest marker when released
  const handleMouseUp = () => {
    const closestMarker = Math.round(value / stepSize) * stepSize;
    setValue(closestMarker);
  };

  return (
    <div className="relative w-full py-6">
      <input
        type="range"
        min="1"
        max={initialMargin}
        value={value}
        step="1"
        onChange={(e) => setValue(Number(e.target.value))}
        onMouseUp={handleMouseUp}
        className="appearance-none slider absolute w-full"
        style={{ zIndex: 2 }}
      />
      <div
        className="absolute grid w-full grid-flow-col content-center justify-between"
        style={{ zIndex: 1 }}
      >
        {Array.from(Array(6).keys()).map((i) => {
          let extraClass = "";
          if (i === 3) extraClass = "adjust-marker-3";
          if (i === 4) extraClass = "adjust-marker-4";
          return (
            <button
              onClick={() => setValue(i * stepSize)}
              className={`h-2 w-2 cursor-pointer rounded-full bg-[#ddd] ${extraClass}`}
            ></button>
          );
        })}
      </div>
      <div className="mt-6 grid grid-flow-col grid-cols-6 content-center justify-between gap-[20px] text-xs">
        {Array.from(Array(6).keys()).map((i) => (
          <div
            className={`${value >= i * stepSize ? "text-gray-light" : ""}`}
            key={i}
          >
            <div className="mt-2">
              {i === 0 ? 1 : Math.round(i * stepSize)}x
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-center">{value}</div>
    </div>
  );
};

export default RangeSlider;
