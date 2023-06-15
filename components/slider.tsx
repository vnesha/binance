import { useState, useEffect, useRef } from "react";

type Props = {
  initialMargin: number;
  selectedPosition: number;
};

const RangeSlider: React.FC<Props> = ({ initialMargin, selectedPosition }) => {
  const [value, setValue] = useState<number>(selectedPosition);
  const thumbRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setValue(selectedPosition);
  }, [selectedPosition]);

  useEffect(() => {
    const thumb = thumbRef.current;
    if (thumb && thumb.parentNode) {
      const thumbWidthPercent =
        (thumb.offsetWidth / (thumb.parentNode as HTMLElement).offsetWidth) *
        100;
      let offsetDirection = value <= initialMargin / 2 ? -20 : -80;
      thumb.style.transform = `translateX(${offsetDirection}%) rotate(45deg)`;
      thumb.style.left = `${(value / initialMargin) * 100}%`;
    }
  }, [value, initialMargin]);

  const totalSteps = 6;
  const stepSize = initialMargin / (totalSteps - 1);

  const progressStyle = {
    width: `${(value / initialMargin) * 100}%`,
  };

  return (
    <div className="flex w-full flex-col items-center py-6">
      <div className="relative m-0 box-border flex h-[25px] w-full min-w-0 items-center justify-between">
        <div className="absolute flex w-full items-center justify-center">
          <div className="h-1 w-full rounded bg-[#474d57] px-1">
            <div
              className="h-1 rounded bg-[#b7bdc6]"
              style={progressStyle}
            ></div>
          </div>
        </div>
        <div className="absolute z-[1] grid w-full grid-flow-col content-center justify-between">
          {Array.from(Array(totalSteps).keys()).map((i) => {
            const isPassed = value >= i * stepSize;
            return (
              <div
                key={i}
                onClick={() => setValue(i * stepSize)}
                className={`box-content h-[6px] w-[6px] origin-center rotate-45 cursor-pointer rounded-sm border-2 border-[#474d57] ${
                  isPassed
                    ? "border-gray-middle-light bg-[#b7bdc6] hover:bg-gray-lighter"
                    : "bg-gray hover:border-gray-middle-light hover:bg-[#474d57]"
                }`}
                style={{
                  left: `calc(${((i * stepSize) / initialMargin) * 100}% + ${
                    (thumbRef.current?.offsetWidth || 0) / 2
                  }px)`,
                }}
              ></div>
            );
          })}
        </div>

        <div className="absolute flex w-full items-center justify-center">
          <input
            type="range"
            min="1"
            max={initialMargin}
            value={value}
            step="1"
            onChange={(e) => setValue(Number(e.target.value))}
            className="slider w-full cursor-pointer appearance-none bg-gray/0"
          />
        </div>
        <div ref={thumbRef} className="custom-thumb"></div>
      </div>
      <div className="mt-6 grid grid-flow-col grid-cols-6 content-center justify-between gap-[20px] text-xs">
        {Array.from(Array(6).keys()).map((i) => (
          <div
            className={`${value >= i * stepSize ? "text-gray-light" : ""}`}
            key={i}
          >
            <div>{i === 0 ? 1 : Math.round(i * stepSize)}x</div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-center">{value === 0 ? 1 : value}</div>
    </div>
  );
};

export default RangeSlider;
