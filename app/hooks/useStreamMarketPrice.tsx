import useWebSocket, { ReadyState } from "react-use-websocket";
import { useEffect, useState } from "react";
import { formatNumber } from "../../util/formatingNumber";

export const useStreamMarketPrice = (positionSymbol, onPriceUpdate) => {
  const [socketError, setSocketError] = useState(null);

  const {
    lastMessage: lastTradeMessage,
    readyState: tradeReadyState,
    getWebSocket,
  } = useWebSocket(
    `wss://fstream.binance.com/ws/${positionSymbol.toLowerCase()}@trade`,
    {
      shouldReconnect: (closeEvent) => {
        if (closeEvent.code === 1000) {
          // WebSocket connection closed normally, no need to reconnect
          return false;
        } else {
          // WebSocket connection closed unexpectedly, reconnect
          console.log("Reconnecting...");
          return true;
        }
      },
      reconnectAttempts: 10,
      reconnectInterval: 1000,
    }
  );

  let price;

  if (tradeReadyState === ReadyState.OPEN && lastTradeMessage) {
    price = parseFloat(JSON.parse(lastTradeMessage.data)["p"]);
  }

  useEffect(() => {
    if (price !== null) {
      onPriceUpdate(positionSymbol, price);
    }
  }, [price, onPriceUpdate, positionSymbol]);

  useEffect(() => {
    const socket = getWebSocket();

    if (socket) {
      const handleError = (event) => {
        setSocketError(new Error("An error occurred with the WebSocket."));
      };

      socket.addEventListener("error", handleError);

      return () => {
        socket.removeEventListener("error", handleError);
      };
    }
  }, [getWebSocket]);

  return { livePrice: price, socketError };
};

function StreamMarketPrice({
  symbol,
  onPriceUpdate,
  quoteAsset,
  pricePrecision,
}) {
  const { livePrice, socketError } = useStreamMarketPrice(
    symbol,
    onPriceUpdate
  );

  if (socketError) {
    return <div>WebSocket error: {socketError.message}</div>;
  }

  const formattedLivePrice = livePrice
    ? formatNumber(
        livePrice,
        quoteAsset,
        false, // ili true, u zavisnosti od vaših potreba
        pricePrecision,
        { showPlusSign: false, customSuffix: "" }
      )
    : "--";

  return (
    <div className="flex-grow flex-shrink-0 basis-20 w-20">
      {formattedLivePrice}
    </div>
  );
}

export default StreamMarketPrice;
