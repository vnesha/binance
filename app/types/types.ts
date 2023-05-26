export type BinanceResponse = {
    s: string;
    p: string;
  };

export type AccountType = {
    asset: string;
    symbol: string;
    initialMargin: string;
    maintMargin: number;
    marginBalance: number;
    marginRatio: number;
    quoteAsset: string;
    pricePrecision: number;
    baseAsset: string;
  };
  
export type PositionType = {
    symbol: string;
    positionAmt: number;
    price: string;
    positionSymbol: string;
    livePrice: string | null;
    markPrice: string;
    unrealizedProfit: number;
    entryPrice: string;
    liquidationPrice: number;
    leverage: number;
    marginType: string;
  }  
export type ExchangeInfoType = {
    status: string;
    pricePrecision: number;
  };
  
export type CombinedDataType = AccountType & PositionType & {
    unrealizedProfit: number;
    margin: number;
    roe: number;
    contractTypeCapitalized: string;
    exchangeInfoData: ExchangeInfoType | undefined;
    isLoading: boolean;
    side: string;
    positionSide: string;
 };
  