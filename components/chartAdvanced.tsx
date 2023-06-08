"use client";
import React, { useEffect, useRef } from "react";

export declare type AdvancedChartWidgetProps = {
  width?: string | number;
  height?: string | number;
  autosize?: boolean;
  symbol?: string;
  interval?: string;
  range?: string;
  timezone?: string;
  theme?: string;
  style?: string;
  locale?: string;
  toolbar_bg?: string;
  hide_top_toolbar?: boolean;
  hide_side_toolbar?: boolean;
  withdateranges?: boolean;
  save_image?: boolean;
  enable_publishing?: boolean;
  allow_symbol_change?: boolean;
  container_id?: string;
};
declare var TradingView: any;

const AdvancedChart = (props: any) => {
  const { widgetProps, widgetPropsAny } = props;
  let containerId = "advanced-chart-widget-container";
  if (widgetProps?.container_id) {
    containerId = widgetProps.container_id;
  }
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const refValue = ref.current;
    if (refValue) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = () => {
        if (typeof TradingView !== "undefined") {
          new TradingView.widget(
            Object.assign(
              Object.assign(
                {
                  width: "100%",
                  height: "500px",
                  symbol: "BINANCE:BTCUSDT.P",
                  interval: "1",
                  timezone: "Europe/Belgrade",
                  theme: "dark",
                  style: "1",
                  locale: "en",
                  toolbar_bg: "rgb(0, 0, 0)",
                  backgroundColor: "rgb(22, 26, 30)",
                  //gridColor: "rgb(22, 26, 30)",
                  hide_top_toolbar: false,
                  hide_side_toolbar: false,
                  withdateranges: true,
                  save_image: true,
                  enable_publishing: false,
                  allow_symbol_change: true,
                  details: true,
                  hotlist: true,
                  calendar: false,
                  container_id: containerId,
                },
                widgetProps
              ),
              widgetPropsAny
            )
          );
        }
      };
      refValue.appendChild(script);
    }
    return () => {
      if (refValue) {
        while (refValue.firstChild) {
          refValue.removeChild(refValue.firstChild);
        }
      }
    };
  }, [ref, widgetProps, widgetPropsAny, containerId]);
  return React.createElement("div", { id: containerId, ref: ref });
};
export default AdvancedChart;
