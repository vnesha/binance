import axios from "axios";
import { postData } from "./usePostData";
import { AxiosError, AxiosResponse } from "axios";
import { API_URL } from "@/util/cryptoConfig";
import {
  getAccountInfo,
  getExchangeInfo,
  getOpenOrders,
  getSettings,
} from "@/util/apiData";

interface OrderResponse {
  symbol: string;
  orderId: number;
  side: string;
}

export const openOrder = async ({
  symbol,
  markPrice,
  stopLoss,
}: {
  symbol: string;
  markPrice: number;
  stopLoss: number;
}) => {
  const BASE_URL = `${API_URL}/fapi/v1/order`;

  const settings = await getSettings();
  const riskPercent = settings[0].riskPercent;
  const riskRewardRatio = settings[0].riskRewardRatio;
  const openPositionLimit = settings[0].openPositionLimit;
  const autoTrading = settings[0].autoTrading;

  if (!autoTrading) {
    console.log("Auto trading is currently disabled.");
    return { message: "Auto trading is currently disabled." };
  }
  
  const openOrders = await getOpenOrders();
  const existingOrder = openOrders.find(
    (order: any) =>
      order.symbol === symbol && parseFloat(order.positionAmt) !== 0.0
  );
  const openPositionOrders = openOrders.filter(
    (order: any) => parseFloat(order.positionAmt) !== 0.0
  );
  if (openPositionOrders.length >= openPositionLimit) {
    console.log(`Cannot open more positions. The limit is ${openPositionLimit}.`);
    return { message: `Cannot open more positions. The limit is ${openPositionLimit}.` };
  }
    if (existingOrder) {
    console.log(`Order already exists for ${symbol} symbol`);
    return { message: `Order already exists for ${symbol} symbol` };
  }
  const accountInfo = await getAccountInfo();
  const walletBalance = accountInfo?.totalWalletBalance;

  const exchangeInfo = await getExchangeInfo();
  const symbolInfo = exchangeInfo?.symbols.find(
    (item: any) => item.symbol === symbol
  );
  const lotSizeFilter = symbolInfo?.filters.find(
    (filter: { filterType: string }) => filter.filterType === "MARKET_LOT_SIZE"
  );
  const priceFilter = symbolInfo?.filters.find(
    (filter: { filterType: string }) => filter.filterType === "PRICE_FILTER"
  );
  const stepSize = lotSizeFilter?.stepSize;
  const tickSize = priceFilter?.tickSize;
  const baseAssetPrecision =
    stepSize && stepSize.includes(".") ? stepSize.split(".")[1].length : 0;
  const quotePrecision = tickSize
  ? tickSize.toString().split(".")[1]?.length || 0
  : 0;  

  const riskDollars = (riskPercent * walletBalance) / 100;
  const quantityRaw = riskDollars / Math.abs(markPrice - stopLoss);
  const quantity = quantityRaw.toFixed(baseAssetPrecision);

  const takeProfit =
  markPrice > stopLoss
    ? (Number(markPrice) + Math.abs(Number(markPrice) - Number(stopLoss)) * riskRewardRatio).toFixed(quotePrecision)
    : (Number(markPrice) - Math.abs(Number(markPrice) - Number(stopLoss)) * riskRewardRatio).toFixed(quotePrecision);

  const side = markPrice > stopLoss ? "BUY" : "SELL";

  const params = {
    symbol: symbol,
    side: side,
    type: "MARKET",
    quantity: quantity,
    timestamp: Date.now(),
  };

  const config = postData(params);

   try {
    const response: AxiosResponse<OrderResponse> = await axios.post(
      BASE_URL,
      null,
      config
    );
    console.log("Position opened successfully", response.data);

    if (stopLoss) {
      let stopLossNumber = Number(stopLoss);
      const stopLossParams = {
        symbol: symbol,
        side: side === "BUY" ? "SELL" : "BUY",
        type: "STOP_MARKET",
        quantity: quantity,
        stopPrice: stopLossNumber.toFixed(quotePrecision),
        timestamp: Date.now(),
      };

      const stopLossConfig = postData(stopLossParams);

      console.log('Request to set stop loss:', { url: BASE_URL, params: stopLossParams, config: stopLossConfig });

      const stopLossResponse = await axios.post(BASE_URL, null, stopLossConfig);
      console.log(
        "Stop Loss order created successfully",
        stopLossResponse.data
      );
    }

    if (takeProfit) {
      let takeProfitNumber = Number(takeProfit);
      const takeProfitParams = {
        symbol: symbol,
        side: side === "BUY" ? "SELL" : "BUY",
        type: "TAKE_PROFIT_MARKET",
        quantity: quantity,
        stopPrice: takeProfitNumber.toFixed(quotePrecision),
        timestamp: Date.now(),
      };

      const takeProfitConfig = postData(takeProfitParams);

      console.log('Request to set take profit:', { url: BASE_URL, params: takeProfitParams, config: takeProfitConfig });

      const takeProfitResponse = await axios.post(
        BASE_URL,
        null,
        takeProfitConfig
      );
      console.log(
        "Take Profit order created successfully",
        takeProfitResponse.data
      );
    }

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

function handleError(err: unknown): never {
  if (err instanceof Error) {
    throw { message: err.message, details: err.stack };
  } else if (err instanceof AxiosError) {
    throw { message: err.message, details: err.response?.data };
  } else {
    throw { message: "Unknown error", details: err };
  }
}
