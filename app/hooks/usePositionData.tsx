import useWebSocket, { ReadyState } from "react-use-websocket";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "./fetchData";

type BinanceResponse = {
  s: string;
  p: string;
};

type AccountType = {
  asset: string;
  symbol: string;
};

type PositionType = {
  symbol: string;
  positionAmt: string;
  price: string;
  positionSymbol: string;
  livePrice: number | null;
  markPrice: string;
};

const queryOptions: any = {
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  staleTime: 1000,
};

export const usePositionData = () => {
  const [combinedData, setCombinedData] = useState<PositionType[]>([]);
  const { lastJsonMessage, readyState } = useWebSocket(null, {
    shouldReconnect: (closeEvent) => true,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
  });

  // Koristite useRef umesto obične promenljive
  const symbolToWebSocket = useRef<{ [symbol: string]: WebSocket }>({});

  useEffect(() => {
    if (lastJsonMessage) {
      const message = lastJsonMessage as BinanceResponse;
      if (message.s) {
        const currentSymbol = message.s.toUpperCase();
        setCombinedData((oldData) => {
          if (!oldData) {
            return [];
          }
          return oldData.map((item) =>
            item.symbol === currentSymbol
              ? { ...item, livePrice: parseFloat(message.p) }
              : item
          );
        });
      }
    }
  }, [lastJsonMessage]);

  const API_URL =
    process.env.NEXT_PUBLIC_NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_API_URL
      : process.env.NEXT_PUBLIC_TEST_API_URL;

  const urlPosition = () => {
    return fetchData(`${API_URL}/fapi/v2/positionRisk`);
  };
  const urlAccount = () => {
    return fetchData(`${API_URL}/fapi/v2/account`);
  };

  const positions = useQuery(["position"], urlPosition, queryOptions);
  const account = useQuery(["account"], urlAccount, queryOptions);

  useEffect(() => {
    if (positions.data && account.data) {
      const filteredPositions = positions.data.filter(
        (position: PositionType) => Number(position.positionAmt) !== 0
      );

      const filteredSymbols = filteredPositions.map(
        (position: PositionType) => position.symbol
      );

      const filteredAccount = account.data.positions.filter(
        (position: AccountType) => filteredSymbols.includes(position.symbol)
      );

      const initialCombinedData = filteredAccount.map(
        (account: AccountType) => {
          const correspondingPosition = filteredPositions.find(
            (position: PositionType) => position.symbol === account.symbol
          );
          return {
            ...account,
            ...correspondingPosition,
            livePrice: correspondingPosition
              ? parseFloat(correspondingPosition.markPrice)
              : null,
          };
        }
      );
      setCombinedData(initialCombinedData);

      // Set up a WebSocket for each symbol
      filteredSymbols.forEach((symbol: string) => {
        const url = `wss://fstream.binance.com/ws/${symbol.toLowerCase()}@trade`;

        // Koristite symbolToWebSocket.current umesto symbolToWebSocket
        if (
          symbolToWebSocket.current[symbol] &&
          symbolToWebSocket.current[symbol].readyState === WebSocket.OPEN
        ) {
          symbolToWebSocket.current[symbol].close();
        }

        const ws = new WebSocket(url);
        // Koristite symbolToWebSocket.current umesto symbolToWebSocket
        symbolToWebSocket.current[symbol] = ws;

        ws.onerror = (error) => {
          console.error(`WebSocket error: ${error}`);
        };

        ws.onmessage = (event) => {
          const message = JSON.parse(event.data) as BinanceResponse;

          if (message.s) {
            const currentSymbol = message.s.toUpperCase();
            setCombinedData((oldData) => {
              if (!oldData) {
                return [];
              }
              return oldData.map((item) =>
                item.symbol === currentSymbol
                  ? {
                      ...item,
                      livePrice: message.p
                        ? parseFloat(message.p)
                        : parseFloat(item.markPrice),
                    }
                  : item
              );
            });
          }
        };
      });
    }

    // Cleanup function to close all WebSockets when the component unmounts or dependencies change
    return () => {
      Object.values(symbolToWebSocket.current).forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      });
    };
  }, [positions.data, account.data]);

  return { combinedData };
};
