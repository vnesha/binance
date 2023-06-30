interface CostToOpenPositionProps {
    numberOfContracts: number; 
    leverage: number;
    markPrice: number;
    bidPrice: number;
    askPrice: number;
}

interface CostToOpenPositionResult {
    longCost: number;
    shortCost: number;
}

function calculateCostToOpenPosition({numberOfContracts, leverage, markPrice, bidPrice, askPrice}: CostToOpenPositionProps): CostToOpenPositionResult {
    // Calculate for long order
    let assumingPriceLong = askPrice * (1 + 0.05 / 100);
    let initialMarginLong = (assumingPriceLong * numberOfContracts) / leverage;
    let openLossLong = numberOfContracts * Math.abs(Math.min(0, 1 * (markPrice - assumingPriceLong)));
    let longCost = initialMarginLong + openLossLong;
  
    // Calculate for short order
    let assumingPriceShort = bidPrice;
    let initialMarginShort = (assumingPriceShort * numberOfContracts) / leverage;
    let openLossShort = numberOfContracts * Math.abs(Math.min(0, -1 * (markPrice - assumingPriceShort)));
    let shortCost = initialMarginShort + openLossShort;
  
    return { longCost, shortCost };
}
