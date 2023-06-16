import { useState, useEffect, useRef } from "react";

const useTooltip = () => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  let tooltipTimeout = useRef<number | null>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    return () => {
      if (tooltipTimeout.current) {
        clearTimeout(tooltipTimeout.current);
      }
    };
  }, []);

  const showTooltip = (position: number, containerWidth: number) => {
    if (tooltipRef.current) {
      tooltipRef.current.style.left = `${(position / containerWidth) * 100}%`;
      tooltipRef.current.style.display = "block";
    }
  };

  const hideTooltip = () => {
    if (tooltipRef.current) {
      tooltipTimeout.current = window.setTimeout(() => {
        if (tooltipRef.current) {
          tooltipRef.current.style.display = "none";
          setHovered(false);
        }
      }, 1000);
    }
  };

  const stopTooltipTimer = () => {
    if (tooltipTimeout.current) {
      clearTimeout(tooltipTimeout.current);
    }
  };

  return {
    tooltipRef,
    showTooltip,
    hideTooltip,
    stopTooltipTimer,
    hovered,
    setHovered,
  };
};

export default useTooltip;
