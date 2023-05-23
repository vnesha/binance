import useWebSocket, { ReadyState } from "react-use-websocket";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "./fetchData";
import {
  CombinedDataType,
  AccountType,
  PositionType,
  BinanceResponse,
} from "../types/types";

const queryOptions: any = {
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  staleTime: 1000,
};

const calculateUnrealizedProfit = (
  livePrice: string | null,
  position: PositionType | undefined
): number => {
  if (
    livePrice === null ||
    !position ||
    isNaN(Number(livePrice)) ||
    isNaN(Number(position.positionAmt)) ||
    isNaN(Number(position.entryPrice))
  ) {
    return 0;
  }

  return (
    Number(position.positionAmt) *
    (parseFloat(livePrice) - Number(position.entryPrice))
  );
};

export const usePositionData = () => {
  const [combinedData, setCombinedData] = useState<CombinedDataType[]>([]);
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
              ? { ...item, livePrice: message.p }
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
  const urlExchangeInfo = () => {
    return fetchData(`${API_URL}/fapi/v1/exchangeInfo`);
  };

  const positions = useQuery(["position"], urlPosition, queryOptions);
  const account = useQuery(["account"], urlAccount, queryOptions);
  const exchangeInfo = useQuery(
    ["exchangeInfo"],
    urlExchangeInfo,
    queryOptions
  );

  useEffect(() => {
    if (positions.data && account.data && exchangeInfo.data) {
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
          const position = filteredPositions.find(
            (position: PositionType) => position.symbol === account.symbol
          );

          const exchangeInfoData = exchangeInfo.data.symbols.find(
            (info: { symbol: string }) => info.symbol === account.symbol
          );

          let livePrice: string | null = position?.markPrice || null;
          if (lastJsonMessage) {
            const message = lastJsonMessage as BinanceResponse;
            if (message.s && message.s.toUpperCase() === position?.symbol) {
              livePrice = message.p || null;
            }
          }

          const unrealizedProfit = calculateUnrealizedProfit(
            livePrice,
            position
          );

          return {
            ...account,
            ...position,
            exchangeInfoData, // dodajte exchangeInfoData
            livePrice,
            unrealizedProfit,
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
                      livePrice: message.p || item.livePrice,
                      unrealizedProfit: calculateUnrealizedProfit(
                        message.p,
                        item
                      ),
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
  }, [positions.data, account.data, exchangeInfo.data, lastJsonMessage]); // Dodajte exchangeInfo.data u zavisnosti

  return { combinedData };
};