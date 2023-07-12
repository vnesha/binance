import { useEffect, useState } from "react";
import axios from "axios";
import { BinanceResponse, BinanceBookTickerResponse } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/util/cryptoConfig";

const fetchPrice = async (symbol: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/fapi/v1/premiumIndex?symbol=${symbol.toUpperCase()}`
    );
    if (response.data && response.data.markPrice) {
      return response.data.markPrice;
    } else if (response.data && !response.data.markPrice) {
      return "No price available";
    } else {
      throw new Error("No data received from Binance API");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const useAllLivePrices = (
  symbol: string
): { [symbol: string]: { price: string; direction: "up" | "down" | "equally"; bestBid: string; bestAsk: string; markPrice: string; } } => {
  const [allLivePrices, setAllLivePrices] = useState<{
    [symbol: string]: { price: string; direction: "up" | "down" | "equally"; bestBid: string; bestAsk: string; markPrice: string };
  }>({ [symbol]: { price: "Undefined", direction: "up", bestBid: "Undefined", bestAsk: "Undefined", markPrice: "Undefined" } });
  
  const { data, isError, error } = useQuery(
    [symbol],
    () => fetchPrice(symbol),
    {
      onSuccess: (data) => {
        setAllLivePrices((prevPrices) => ({
          ...prevPrices,
          [symbol.toUpperCase()]: { ...prevPrices[symbol.toUpperCase()], price: data },
        }));
      },
    }
  );

  useEffect(() => {
    let cleanupCalled = false;
    let previousPrice: number | null = null;

    if (isError) {
      console.error("Error fetching price:", error);
      return;
    }

    const connectWebSocket = () => {
      const ws = new WebSocket(
        `wss://fstream.binance.com/ws/${symbol.toLowerCase()}@aggTrade`
      );

      const wsBookTicker = new WebSocket(
        `wss://fstream.binance.com/ws/${symbol.toLowerCase()}@bookTicker`
      );

      const wsMarkPrice = new WebSocket(
        `wss://fstream.binance.com/ws/${symbol.toLowerCase()}@markPrice@1s`
      );
        
      ws.onmessage = (event) => {
        if (cleanupCalled) return;
    
        const message = JSON.parse(event.data) as BinanceResponse;
        if (
          message.s &&
          message.s.toUpperCase() === symbol.toUpperCase()
        ) {
          if (!cleanupCalled) {
            const currentPrice = parseFloat(message.p);
            let direction: "up" | "down" | "equally" = "up";
    
            if (previousPrice !== null) {
              if (currentPrice > previousPrice) {
                direction = "up";
              } else if (currentPrice < previousPrice) {
                direction = "down";
              } else {
                direction = "equally";
              }
            }
    
            previousPrice = currentPrice;
    
            setAllLivePrices((prevPrices) => ({
              ...prevPrices,
              [symbol.toUpperCase()]: { ...prevPrices[symbol.toUpperCase()], price: message.p, direction },
            }));
          }
        }
      };

      wsBookTicker.onmessage = (event) =>  {
        if (cleanupCalled) return;

        const message = JSON.parse(event.data) as BinanceBookTickerResponse;
        if (
          message.s &&
          message.s.toUpperCase() === symbol.toUpperCase()
        ) {
          if (!cleanupCalled) {
              setAllLivePrices((prevPrices) => ({
              ...prevPrices,
              [symbol.toUpperCase()]: { ...prevPrices[symbol.toUpperCase()], bestBid: message.b, bestAsk: message.a },
            }));
          }
        }
      };

      wsMarkPrice.onmessage = (event) => {
        if (cleanupCalled) return;
      
        const message = JSON.parse(event.data);
        if (
          message.s &&
          message.s.toUpperCase() === symbol.toUpperCase()
        ) {
          if (!cleanupCalled) {
            setAllLivePrices((prevPrices) => ({
              ...prevPrices,
              [symbol.toUpperCase()]: { ...prevPrices[symbol.toUpperCase()], markPrice: message.p },
            }));
          }
        }
      };
    
      ws.onclose = (event) => {
        console.log("WebSocket connection closed:", event);
        if (!cleanupCalled) {
          // Ignore normal closures and endpoint gone
          if (event.code !== 1000 && event.code !== 1001) {
            setTimeout(connectWebSocket, 5000); // Reconnect after 5 seconds
          }
        }
      };

      wsBookTicker.onclose = (event) => {
        console.log("WebSocket bookTicker connection closed:", event);
        if (!cleanupCalled) {
          // Ignore normal closures and endpoint gone
          if (event.code !== 1000 && event.code !== 1001) {
            setTimeout(connectWebSocket, 5000); // Reconnect after 5 seconds
          }
        }
      };

      wsMarkPrice.onclose = (event) => {
        console.log("WebSocket markPrice connection closed:", event);
        if (!cleanupCalled) {
          // Ignore normal closures and endpoint gone
          if (event.code !== 1000 && event.code !== 1001) {
            setTimeout(connectWebSocket, 5000); // Reconnect after 5 seconds
          }
        }
      };

      return () => {
        cleanupCalled = true;
    
        if (ws && ws.readyState && ws.readyState <= WebSocket.OPEN) {
          ws.close();
        }

        if (wsBookTicker && wsBookTicker.readyState && wsBookTicker.readyState <= WebSocket.OPEN) {
          wsBookTicker.close();
        }

        if (wsMarkPrice && wsMarkPrice.readyState && wsMarkPrice.readyState <= WebSocket.OPEN) {
          wsMarkPrice.close();
        }
      };
    };
    
    connectWebSocket();
    
  }, [symbol, isError]);

  return allLivePrices;
};

export default useAllLivePrices;
