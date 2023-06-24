import { useEffect, useState } from "react";
import axios from "axios";
import { BinanceResponse } from "../types/types";
import { useQuery } from "@tanstack/react-query";

const fetchPrice = async (symbol: string) => {
  try {
    const response = await axios.get(`https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${symbol.toUpperCase()}`);
    if (response.data && response.data.markPrice) {
      return response.data.markPrice;
    } else if (response.data && !response.data.markPrice) {
      return 'No price available';
    } else {
      throw new Error('No data received from Binance API');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const useAllLivePrices = (symbol: string): { [symbol: string]: string } => {
  const [allLivePrices, setAllLivePrices] = useState<{ [symbol: string]: string }>({ [symbol]: 'Undefined' });

  const { data, isError, error } = useQuery([symbol], () => fetchPrice(symbol), {
    onSuccess: (data) => {
      setAllLivePrices((prevPrices) => ({
        ...prevPrices,
        [symbol.toUpperCase()]: data,
      }));
    },
  })

  useEffect(() => {
    let cleanupCalled = false;
  
    if (isError) {
      console.error('Error fetching price:', error);
      return;
    }
  
    const connectWebSocket = () => {
      const ws = new WebSocket(`wss://fstream.binance.com/ws/${symbol.toLowerCase()}@trade`);
    
      ws.onmessage = (event) => {
        if (cleanupCalled) return;
    
        const message = JSON.parse(event.data) as BinanceResponse;
        if (message.s && message.s.toUpperCase() === symbol.toUpperCase()) {
          if (!cleanupCalled) {
            setAllLivePrices((prevPrices) => ({
              ...prevPrices,
              [symbol.toUpperCase()]: message.p,
            }));
          }
        }
      };
  
      ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
        if (!cleanupCalled) {
          // Ignore normal closures and endpoint gone
          if (event.code !== 1000 && event.code !== 1001) {
            setTimeout(connectWebSocket, 5000); // Reconnect after 5 seconds
          }
        }
      };
    
      return ws;
    };
  
    const ws = connectWebSocket();
    
    return () => {
      cleanupCalled = true;
  
      if (ws.readyState <= WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [symbol, isError]);
  
  

  return allLivePrices;
};

export default useAllLivePrices;
