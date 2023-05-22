import useWebSocket, { ReadyState } from "react-use-websocket";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "./fetchData";

type BinanceResponse = {
  e: string;
  E: number;
  s: string;
  p: string;
  q: string;
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
};

const queryOptions: any = {
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  staleTime: 1000,
};

export const usePositionData = () => {
  const [combinedData, setCombinedData] = useState<PositionType[]>([]);
  const [socketUrl, setSocketUrl] = useState<string | null>(null);
  const { lastJsonMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: (closeEvent) => true,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
  });

  //console.log("WebSocket ReadyState", ReadyState[readyState]);

  useEffect(() => {
    if (lastJsonMessage) {
      //console.log("Raw WebSocket message:", lastJsonMessage);

      const message = lastJsonMessage as BinanceResponse;
      if (message.s) {
        const currentSymbol = message.s.toUpperCase();
        //console.log("Processed WebSocket message:", currentSymbol, message.p);

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

  // Create a mapping from symbol to WebSocket
  const symbolToWebSocket: { [symbol: string]: WebSocket } = {};

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
        (account: AccountType) => ({
          ...account,
          ...filteredPositions.find(
            (position: PositionType) => position.symbol === account.symbol
          ),
        })
      );

      setCombinedData(initialCombinedData);

      // Set up a WebSocket for each symbol
      filteredSymbols.forEach((symbol: string) => {
        const url = `wss://fstream.binance.com/ws/${symbol.toLowerCase()}@trade`;

        if (symbolToWebSocket[symbol]) {
          symbolToWebSocket[symbol].close();
        }

        const ws = new WebSocket(url);
        symbolToWebSocket[symbol] = ws;

        ws.onmessage = (event) => {
          const message = JSON.parse(event.data) as BinanceResponse;

          if (message.s) {
            const currentSymbol = message.s.toUpperCase();
            // console.log(
            //   "Processed WebSocket message:",
            //   currentSymbol,
            //   message.p
            // );

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
        };
      });
    }
  }, [positions.data, account.data]);

  return { combinedData };
};
