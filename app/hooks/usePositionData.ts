import useWebSocket, { ReadyState } from "react-use-websocket";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "./fetchData";
import {
  CombinedDataType,
  AccountType,
  PositionType,
  BinanceResponse,
  SymbolInfo,
} from "../types/types";

const queryOptions: any = {
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  staleTime: 1000,
};

const calculateUnrealizedProfitAndMarginROE = (
  livePrice: string | null,
  position: PositionType | undefined
): { unrealizedProfit: number; margin: number; roe: number } => {
  if (
    livePrice === null ||
    !position ||
    isNaN(Number(livePrice)) ||
    isNaN(Number(position.positionAmt)) ||
    isNaN(Number(position.entryPrice)) ||
    isNaN(Number(position.leverage))
  ) {
    return { unrealizedProfit: 0, margin: 0, roe: 0 };
  }

  const unrealizedProfit =
    Number(position.positionAmt) *
    (parseFloat(livePrice) - Number(position.entryPrice));

  const margin =
    Math.abs(Number(position.positionAmt) * parseFloat(livePrice)) /
    Number(position.leverage);
  const roe = (unrealizedProfit / margin) * 100;

  return { unrealizedProfit, margin, roe };
};

export const usePositionData = () => {
  const [perpetualSymbols, setPerpetualSymbols] = useState<string[]>([]);
  const [baseAssetAll, setBaseAssetAll] = useState<string[]>([]);
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

  const isLoading =
    positions.isLoading || account.isLoading || exchangeInfo.isLoading;
  const isError = positions.isError || account.isError || exchangeInfo.isError;

  useEffect(() => {
    if (
      positions.data &&
      Array.isArray(positions.data) &&
      account.data &&
      exchangeInfo.data
    ) {
      const filteredPositions = positions.data.filter(
        (position: PositionType) => Number(position.positionAmt) !== 0
      );

      const filteredSymbols = filteredPositions.map(
        (position: PositionType) => position.symbol
      );

      const filteredAccount = account.data.positions.filter(
        (position: AccountType) => filteredSymbols.includes(position.symbol)
      );

      const filteredAssets = account.data.assets.filter(
        (asset: AccountType) => asset.asset === "USDT"
      );

      const initialCombinedData = filteredAccount.map(
        (account: AccountType) => {
          const position = filteredPositions.find(
            (position: PositionType) => position.symbol === account.symbol
          );

          const asset = filteredAssets.find(
            (asset: AccountType) => asset.asset === "USDT"
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

          const { unrealizedProfit, margin, roe } =
            calculateUnrealizedProfitAndMarginROE(livePrice, position);

          let marginRatio = null;
          if (asset && asset.maintMargin && asset.marginBalance) {
            marginRatio = (asset.maintMargin / asset.marginBalance) * 100;
          }

          const contractType = exchangeInfoData?.contractType.toLowerCase();
          const contractTypeCapitalized =
            contractType.charAt(0).toUpperCase() + contractType.slice(1);

          const baseAsset = exchangeInfoData?.baseAsset; // Keep this as before
          const quoteAsset = exchangeInfoData?.quoteAsset; // Keep this as before

          return {
            ...account,
            ...position,
            asset,
            exchangeInfoData,
            livePrice,
            unrealizedProfit,
            margin,
            roe,
            marginRatio,
            quoteAsset,
            baseAsset,
            pricePrecision: exchangeInfoData?.pricePrecision,
            contractTypeCapitalized,
          };
        }
      );
      setCombinedData(initialCombinedData);

      const baseAssetArray = exchangeInfo.data?.symbols.map(
        (symbolData: any) => symbolData.baseAsset
      );

      setBaseAssetAll(baseAssetArray);

      const perpetualSymbolsArray = exchangeInfo.data?.symbols
        .filter(
          (symbolData: any) =>
            symbolData.contractType === "PERPETUAL" &&
            symbolData.symbol.endsWith("USDT")
        )
        .map((symbolData: any) => symbolData.symbol);

      setPerpetualSymbols(perpetualSymbolsArray);

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
              return oldData.map((item) => {
                if (item.symbol === currentSymbol) {
                  const { unrealizedProfit, margin, roe } =
                    calculateUnrealizedProfitAndMarginROE(message.p, item);

                  return {
                    ...item,
                    livePrice: message.p || item.livePrice,
                    unrealizedProfit,
                    margin,
                    roe,
                  };
                } else {
                  return item;
                }
              });
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
  return {
    combinedData,
    isLoading,
    isError,
    perpetualSymbols,
    baseAssetAll,
  };
};
