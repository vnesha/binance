import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { BinanceResponse } from "../types/types";

const useAllLivePrices = (symbol: string): { [symbol: string]: string } => {
  const [allLivePrices, setAllLivePrices] = useState<{ [symbol: string]: string }>({});

  const { lastJsonMessage } = useWebSocket(null, {
    shouldReconnect: (closeEvent) => true,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
  });

  useEffect(() => {
    const ws = new WebSocket(`wss://fstream.binance.com/ws/${symbol.toLowerCase()}@trade`);
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data) as BinanceResponse;
      if (message.s && message.s.toUpperCase() === symbol.toUpperCase()) {
        setAllLivePrices((prevPrices) => ({
          ...prevPrices,
          [symbol.toUpperCase()]: message.p,
        }));
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [symbol]);

  return allLivePrices;
};

export default useAllLivePrices;
