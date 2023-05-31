"use client";
import React, { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    const chartElement = document.getElementById("chart");
    if (chartElement && !document.getElementById("tradingViewScript")) {
      const script = document.createElement("script");
      script.id = "tradingViewScript";
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbols: [
          {
            proName: "BINANCE:BTCUSDT.P",
            title: "BTC",
          },
          {
            proName: "BINANCE:ETHUSDT.P",
            title: "ETH",
          },
          {
            proName: "BINANCE:DOTUSDT.P",
            title: "DOT",
          },
        ],
        colorTheme: "dark",
        isTransparent: false,
        displayMode: "adaptive",
        locale: "in",
      });

      chartElement.appendChild(script);
    }
  }, []);

  return <div id="chart"> </div>;
};

export default Home;
