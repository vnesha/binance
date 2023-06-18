import React, { useState, useEffect, useRef } from "react";
import useTooltip from "@/app/hooks/useTootltip"; // pretpostavimo da je useTooltip u istom direktorijumu
import ChangeLeverageButton from "./buttonChangeLeverage";
import { rangeSliderProps } from "@/app/types/types";

const RangeSlider: React.FC<rangeSliderProps> = ({
  initialMargin,
  selectedPosition,
  selectedSymbol,
}) => {
  const [value, setValue] = useState<number>(0);
  const hoverRef = useRef<HTMLDivElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const displayValue = (val: number) => (val === 0 ? 1 : val);

  const setRefs = (element: any) => {
    hoverRef.current = element;
    sliderRef.current = element;
  };

  const totalSteps = 6;
  const stepSize = initialMargin / (totalSteps - 1);

  const progressStyle = {
    width: `${(value / initialMargin) * 100}%`,
  };

  const thumbWidth = 16;
  const trackWidth = 95.5;

  const { tooltipRef, showTooltip, hideTooltip, stopTooltipTimer } =
    useTooltip();

  useEffect(() => {
    setValue(selectedPosition);
  }, []);

  useEffect(() => {
    if (initialMargin > 0 && value === 0) {
      setValue(Number(selectedPosition));
    }
  }, [initialMargin, selectedPosition]);

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();

    const handleMouseMove = (e: MouseEvent) => {
      let currentValue = value;
      if (sliderRef.current) {
        const sliderRect = sliderRef.current.getBoundingClientRect();
        let newValue = Math.floor(
          ((e.clientX - sliderRect.left - thumbWidth / 2) /
            (sliderRect.width - thumbWidth)) *
            (initialMargin - 1)
        );
        newValue = Math.max(1, Math.min(newValue + 1, initialMargin));
        if (newValue !== currentValue) {
          setValue(newValue);
          currentValue = newValue;
        }

        const tooltipWidth = tooltipRef.current?.offsetWidth || 0;
        const thumbPosition =
          (hoverRef.current?.getBoundingClientRect().left || 0) +
          thumbWidth / 2 -
          (sliderRef.current?.getBoundingClientRect().left || 0);
        const tooltipPosition = thumbPosition - tooltipWidth / 2;

        if (tooltipRef.current) {
          tooltipRef.current.style.left = `${tooltipPosition}px`;
        }

        showTooltip(currentValue, initialMargin);
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleSliderClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (sliderRef.current) {
      const sliderRect = sliderRef.current.getBoundingClientRect();
      let newValue = Math.floor(
        ((e.clientX - sliderRect.left - thumbWidth / 2) /
          (sliderRect.width - thumbWidth)) *
          (initialMargin - 1)
      );
      newValue = Math.max(1, Math.min(newValue + 1, initialMargin));
      setValue(newValue);

      const tooltipWidth = tooltipRef.current?.offsetWidth || 0;
      const thumbPosition =
        (hoverRef.current?.getBoundingClientRect().left || 0) +
        thumbWidth / 2 -
        (sliderRef.current?.getBoundingClientRect().left || 0);
      const tooltipPosition = thumbPosition - tooltipWidth / 2;

      if (tooltipRef.current) {
        tooltipRef.current.style.left = `${tooltipPosition}px`;
      }

      showTooltip(newValue, initialMargin);
    }
  };

  const handleIncrease = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (value < initialMargin) {
      setValue((prevValue) => {
        let newValue = Math.min(prevValue + 1, initialMargin);
        return newValue;
      });
    }
  };

  const handleDecrease = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (value > 1) {
      setValue((prevValue) => {
        let newValue = Math.max(prevValue - 1, 1);
        return newValue;
      });
    }
  };

  return (
    <div className="flex w-full select-none flex-col items-center ">
      <div className="py-6">
        {/* Input Field */}
        <div className="w-full">
          <div className="mb-1 text-sm">Leverage</div>
          <div className="box-border flex h-12 flex-row justify-between rounded-[4px] bg-[#2b3139] p-[12px]">
            <button
              onClick={handleDecrease}
              className="box-border h-6 w-6 cursor-pointer text-gray-light hover:text-gray-lighter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M3 10.5v3h18v-3H3z" fill="currentColor"></path>
              </svg>
            </button>
            <div className="text-[16px] text-gray-lighter">
              {value === 0 ? 1 : value}x
            </div>
            <button
              onClick={handleIncrease}
              className="box-border h-6 w-6 cursor-pointer text-gray-light hover:text-gray-lighter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M13.5 3h-3v7.5H3v3h7.5V21h3v-7.5H21v-3h-7.5V3z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        {/* Range Slider */}
        <div
          className="relative mt-6 box-border flex h-[25px] w-full min-w-0 select-none items-center justify-between"
          ref={setRefs}
          onMouseEnter={() => {
            stopTooltipTimer();
            showTooltip(value, initialMargin);
          }}
          onClick={handleSliderClick}
          onMouseLeave={hideTooltip}
        >
          {/* Progress Bar */}
          <div className="absolute flex w-full items-center justify-center">
            <div className="h-1 w-full rounded bg-[#474d57] px-1">
              <div
                className="h-1 rounded bg-[#b7bdc6]"
                style={progressStyle}
              ></div>
            </div>
          </div>
          {/* Markers */}
          <div className="absolute grid w-full grid-flow-col content-center justify-between">
            {Array.from(Array(totalSteps).keys()).map((i) => {
              const isPassed = value >= i * stepSize;
              return (
                <div
                  data-key={i}
                  ref={hoverRef}
                  onMouseEnter={() => {
                    stopTooltipTimer();
                    showTooltip(value, initialMargin);
                  }}
                  onMouseLeave={hideTooltip}
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setValue(i * stepSize);
                  }}
                  className={`box-content h-[6px] w-[6px] origin-center rotate-45 cursor-pointer select-none rounded-sm border-2 border-[#474d57] ${
                    isPassed
                      ? "border-gray-middle-light bg-[#b7bdc6] hover:bg-gray-lighter"
                      : "bg-gray hover:border-gray-middle-light hover:bg-[#474d57]"
                  }`}
                  style={{
                    left: `calc(${((i * stepSize) / initialMargin) * 100}% + ${
                      (hoverRef.current?.offsetWidth || 0) / 2
                    }px)`,
                  }}
                ></div>
              );
            })}
          </div>
          {/* Original Slider */}
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
          {/* Custom Thumb */}
          <div
            ref={hoverRef}
            className="custom-thumb"
            style={{
              left: `calc(${(value / initialMargin) * trackWidth + 2.2}% - ${
                thumbWidth / 2
              }px)`,
              width: `${thumbWidth}px`,
            }}
            onMouseDown={handleDragStart}
            onMouseEnter={() => {
              stopTooltipTimer();
              showTooltip(value, initialMargin);
            }}
            onMouseLeave={hideTooltip}
          ></div>
          <div ref={tooltipRef} className="tooltip text-sm">
            {displayValue(value)}x
          </div>
        </div>
        {/* Options */}
        <div className="mt-4 grid w-full cursor-pointer select-none grid-flow-col grid-cols-6 content-center justify-between gap-[40px] text-sm">
          {Array.from(Array(6).keys()).map((i) => {
            const isPassed = value >= i * stepSize; // dodajte ovo
            return (
              <div
                data-key={i}
                ref={hoverRef}
                onMouseEnter={() => {
                  stopTooltipTimer();
                  showTooltip(value, initialMargin);
                  const marker = document.querySelector(`div[data-key="${i}"]`);
                  if (marker) {
                    if (isPassed) {
                      marker.classList.add("hover-effect-passed");
                    } else {
                      marker.classList.add("hover-effect-not-passed");
                    }
                  }
                }}
                onMouseLeave={() => {
                  hideTooltip();
                  const marker = document.querySelector(`div[data-key="${i}"]`);
                  if (marker) {
                    if (isPassed) {
                      marker.classList.remove("hover-effect-passed");
                    } else {
                      marker.classList.remove("hover-effect-not-passed");
                    }
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  const newValue = i * stepSize;
                  setValue(newValue);
                  showTooltip(displayValue(newValue), initialMargin);
                }}
                className={`${value >= i * stepSize ? "text-gray-light" : ""}`}
                key={i}
              >
                <div>{i === 0 ? 1 : Math.round(i * stepSize)}x</div>
              </div>
            );
          })}
        </div>
      </div>
      <ChangeLeverageButton symbol={selectedSymbol} leverage={value} />
    </div>
  );
};

export default RangeSlider;
