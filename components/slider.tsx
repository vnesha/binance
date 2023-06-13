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

  return (
    <div className="w-full py-6">
      <input
        type="range"
        min="1"
        max={initialMargin}
        value={value}
        step="1"
        onChange={(e) => setValue(Number(e.target.value))}
        className="slider"
      />
      <div className="absolute left-[14px] mt-2 flex space-x-[23px] text-xs">
        {Array.from(Array(6).keys()).map((i) => (
          <div
            className={`relative top-[-8px] ${
              value >= i * stepSize ? "text-green-500" : ""
            }`}
            key={i}
          >
            <div
              className={`bg-current absolute bottom-[-2px] left-[-6px] h-1 w-1 rounded-full ${
                value >= i * stepSize ? "animate-bounce" : ""
              }`}
            ></div>
            {i === 0 ? 1 : Math.round(i * stepSize)}x
          </div>
        ))}
      </div>
    </div>
  );
};

export default RangeSlider;
