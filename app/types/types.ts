export type BinanceResponse = {
    s: string;
    p: string;
  };

export type AccountType = {
    asset: string;
    symbol: string;
    initialMargin: string;
  };
  
export type PositionType = {
    symbol: string;
    positionAmt: string;
    price: string;
    positionSymbol: string;
    livePrice: string | null;
    markPrice: string;
    unrealizedProfit: number;
    entryPrice: string;
  };
  
export type ExchangeInfoType = {
    status: string;
    quoteAsset: string;
    baseAsset: string;
    pricePrecision: number;
  };
  
export type CombinedDataType = AccountType & PositionType & {
    unrealizedProfit: number;
    exchangeInfoData: ExchangeInfoType | undefined;
  };
  