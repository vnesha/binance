export type BinanceResponse = {
    s: string;
    p: string;
  };

export type SymbolInfo = {
    symbol: string;
    status: string;
    baseAsset: string;
    baseAssetPrecision: number;
    quoteAsset: string;
    quotePrecision: number;
    quoteAssetPrecision: number;
    baseCommissionPrecision: number;
    quoteCommissionPrecision: number;
    orderTypes: string[];
    icebergAllowed: boolean;
    ocoAllowed: boolean;
    isSpotTradingAllowed: boolean;
    isMarginTradingAllowed: boolean;
    filters: any[];
    permissions: string[];
    contractType: string;
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
  
export type CombinedDataType = AccountType & PositionType & SymbolInfo & {
    unrealizedProfit: number;
    margin: number;
    roe: number;
    contractTypeCapitalized: string;
    exchangeInfoData: ExchangeInfoType | undefined;
    isLoading: boolean;
    side: string;
    positionSide: string;
    baseAssetAllSymbols: string;
    quoteAssetAllSymbols: string;
  };

  export type Order = {
    symbol: string;
    orderId: number;
    price: number;
    stopPrice: number;
    time: string;
    type: string;
    side: string;
    origQty: number;
    reduceOnly: number;
    priceProtect: number;
    executedQty: number;
  };
  
  export type OrderDataRowProps = {
    order: Order;
    index: number; 
    exchangeInfo: any;
    
 };

 export type leverageDataProps = {
  leverage: any;
  exchangeInfo: any;
  
}
 export interface AxiosError {
  message: string;
  response?: {
    status: number;
    data: any;
  };
}
  