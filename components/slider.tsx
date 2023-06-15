import { useState, useEffect, useRef } from "react";

type Props = {
  initialMargin: number;
  selectedPosition: number;
};

const RangeSlider: React.FC<Props> = ({ initialMargin, selectedPosition }) => {
  const [value, setValue] = useState<number>(selectedPosition);
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const totalSteps = 6;
  const stepSize = initialMargin / (totalSteps - 1);

  const progressStyle = {
    width: `${(value / initialMargin) * 100}%`,
  };

  const thumbWidth = 16;
  const trackWidth = 95.5;

  useEffect(() => {
    setValue(selectedPosition);
  }, [selectedPosition]);

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();

    const handleMouseMove = (e: MouseEvent) => {
      if (sliderRef.current) {
        const sliderRect = sliderRef.current.getBoundingClientRect();
        let newValue = Math.floor(
          ((e.clientX - sliderRect.left - thumbWidth / 2) /
            (sliderRect.width - thumbWidth)) *
            initialMargin
        );
        newValue = Math.max(0, Math.min(newValue, initialMargin));
        setValue(newValue);
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="flex w-full select-none flex-col items-center py-6">
      <div
        ref={sliderRef}
        className="relative m-0 box-border flex h-[25px] w-full min-w-0 select-none items-center justify-between"
      >
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
                className={`box-content h-[6px] w-[6px] origin-center rotate-45 cursor-pointer select-none rounded-sm border-2 border-[#474d57] ${
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

        <div className="absolute flex w-full select-none items-center justify-center">
          <input
            type="range"
            min="1"
            max={initialMargin}
            value={value}
            step="1"
            onInput={(e) =>
              setValue(Number((e.target as HTMLInputElement).value))
            }
            className="slider w-full cursor-pointer appearance-none bg-gray/0"
          />
        </div>
        <div
          ref={thumbRef}
          className="custom-thumb"
          style={{
            left: `calc(${(value / initialMargin) * trackWidth + 2.2}% - ${
              thumbWidth / 2
            }px)`,
            width: `${thumbWidth}px`,
          }}
          onMouseDown={handleDragStart}
        ></div>
      </div>
      <div className="mt-4 grid select-none grid-flow-col grid-cols-6 content-center justify-between gap-[20px] text-xs">
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
